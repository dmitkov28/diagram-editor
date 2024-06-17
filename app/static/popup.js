import { exportDiagram } from "./exportDiagram.js";

const template = document.getElementById("popup")

export class Popup extends HTMLElement {
    #root;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "closed" })
    }

    connectedCallback() {
        this.#root.appendChild(template.content.cloneNode(true));
        const button = this.#root.querySelector("button");
        const span = this.#root.querySelector("span");
        const display = getComputedStyle(span).display;

        button.addEventListener("click", () => {
            if (display == "block") {
                span.style.display = "none"
            } else {
                span.style.display = "block"
            }
        })

        document.querySelector("body").addEventListener("click", (e) => {
            if (e.target !== this) {
                span.style.display = "none";
            }
        })

        this.#root.querySelector("ul").addEventListener("click", (e) => {
            const outputType = e.target.textContent;
            exportDiagram(outputType);
            span.style.display = "none"
        })
    }
}

window.customElements.define("popup-component", Popup);