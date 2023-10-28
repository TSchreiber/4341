class CartCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.product = JSON.parse(this.getAttribute('data-product'));
        let style = document.createElement("style");
        style.innerText = `
            * {
                margin: 0;
                padding: 0;
            }

            :host {
                display: flex;
                max-width: 20ch;
                gap: 4px;
                border-top: solid black 1px;
                padding-top: 8px;
            }

            .name {
                margin-bottom: 4px;
                font-size: 1em;
            }

            .price {
                font-size: 1.1em;
            }

            button {
                cursor: pointer;
            }
        `;
        this.shadowRoot.appendChild(style);

        let div = document.createElement("div");
        div.innerHTML = `
            <div>
                <p class="name">${this.product.name}</p>
                <p class="price">$${this.product.price/100.0}</p>
            </div>
            `;
        this.shadowRoot.appendChild(div);

        this.removeFromCartButton = document.createElement("button");
        this.removeFromCartButton.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`
        this.shadowRoot.appendChild(this.removeFromCartButton);
    }

    addEventListener(type, handler) {
        if (!this.isConnected) {
            setTimeout(() => this.addEventListener(type,handler), 0);
            return;
        }
        switch (type) {
            case "removeFromCart":
                this.removeFromCartButton.addEventListener("click", handler);
                break;

            default:
                super.addEventListener(type, handler);
        }
    }
}
customElements.define('cart-card', CartCard);