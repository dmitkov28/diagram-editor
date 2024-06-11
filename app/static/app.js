import { values } from "./editorConfig.js";
  
require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
});

const wsDiagrams = new WebSocket("ws://localhost:8000/ws")
const wsCompletions = new WebSocket("ws://localhost:8000/completions");

wsCompletions.addEventListener("open", (_) => {
  console.log("WebSocket connected.");
});

wsDiagrams.addEventListener("open", (_) => {
  console.log("WebSocket connected.");
});


wsDiagrams.addEventListener("message", (e) => {
  const diagram = e.data;
  document.getElementById("diagram").innerHTML = diagram
})


require(["vs/editor/editor.main"], function () {
  var editor = monaco.editor.create(document.getElementById("editor"), {
    value: values,
    language: "python",
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "smart",
    theme: "vs-dark",
    minimap: { enabled: false },
  });

  if (values){
    wsDiagrams.send(JSON.stringify(values))
  }


  let timeoutId;
  editor.onDidChangeModelContent(async (e) => {
    const code = editor.getValue();
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      wsDiagrams.send(JSON.stringify(code))
    }, 500)
  })

  function createDependencyProposalsFromServer(range, completions) {
    return completions.map((item) => ({
      //TODO: fix kind & documentation to correctly match completions
      label: item.label,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: item.documentation,
      insertText: item.insertText,
      range: range,
    }));
  }

  monaco.languages.registerCompletionItemProvider("python", {
    triggerCharacters: [".", " "],
    provideCompletionItems: function (model, position) {
      return new Promise((resolve, reject) => {
        // const textUntilPosition = model.getValueInRange({
        //   startLineNumber: 1,
        //   startColumn: 1,
        //   endLineNumber: position.lineNumber,
        //   endColumn: position.column,
        // });

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const messageListener = (e) => {
          const data = JSON.parse(e.data);
          if (data.result && data.result.completions) {
            const suggestions = createDependencyProposalsFromServer(
              range,
              data.result.completions
            );
            resolve({ suggestions: suggestions });
          } else {
            resolve({ suggestions: [] });
          }

          wsCompletions.removeEventListener("message", messageListener);
        };

        wsCompletions.addEventListener("message", messageListener);

        wsCompletions.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "textDocument/completion",
            params: {
              textDocument: {
                uri: "/dev/null",
                languageId: "python",
                text: editor.getValue(),
              },
              position: {
                line: position.lineNumber,
                character: position.column - 1,
              },
            },
          })
        );
      });
    },
  });
});


