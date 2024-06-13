import { values } from "./editorConfig.js";
import { Popup } from "./popup.js";

require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
});


const apiUrl = document.querySelector('[data-api-url]').dataset.apiUrl
const wsDiagrams = new WebSocket(`${apiUrl}/ws`)
const wsCompletions = new WebSocket(`${apiUrl}/completions`);

wsCompletions.addEventListener("open", (_) => {
  console.log("WebSocket connected.");
});

wsDiagrams.addEventListener("open", (_) => {
  console.log("WebSocket connected.");
});

const diagramContainer = document.getElementById("diagram");
const svg = document.getElementById("svg");

wsDiagrams.addEventListener("message", (e) => {
  const diagram = e.data;
  if (diagram) {
    svg.innerHTML = diagram
    
    const popup = document.createElement("popup-component")
    popup.style.position = "absolute";
    popup.style.top = "2rem";
    popup.style.right = "1rem"
    diagramContainer.appendChild(popup)
  } else {
    diagramContainer.replaceChildren();
  }
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

  if (values) {
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

  const completionTypes = {
    "function": monaco.languages.CompletionItemKind.Function,
    "module": monaco.languages.CompletionItemKind.Module,
    "class": monaco.languages.CompletionItemKind.Class,
    "method": monaco.languages.CompletionItemKind.Method,
    "property": monaco.languages.CompletionItemKind.Property,
    "variable": monaco.languages.CompletionItemKind.Variable,
  }

  function createDependencyProposalsFromServer(range, completions) {
    return completions.map((item) => ({
      label: item.label,
      kind: completionTypes[item.kind],
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



