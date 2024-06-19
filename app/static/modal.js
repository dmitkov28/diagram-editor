const template = document.createElement("template")
template.innerHTML = `
<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2
    }

    .modal {
        background-color: white;
        padding: 1rem 2rem;
        z-index: 9999;
        width: 80%;
        margin: auto;
        position: absolute;
        display: flex;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        font-family: sans-serif;
        text-align: center;
        line-height: 2em;
        font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
        .backdrop {
            display: block;
        }
      }
</style>
<div class="backdrop">
      <div class="modal">📱 Oops. You seem to be on a mobile device. Switch to a desktop for the best experience!</div>
</div>
`
export class ModalWarning extends HTMLElement {
    #root;
    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "closed" })
        this.#root.appendChild(template.content.cloneNode(true))
    }
}

window.customElements.define("modal-warning", ModalWarning);