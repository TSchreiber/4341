class CartCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.product = JSON.parse(this.getAttribute('data-product'));
        let style = `
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
        let html = `
            <div>
                <p class="name">${this.product.name}</p>
                <p class="price">$${this.product.price/100.0}</p>
            </div>
            <button onclick="handle_removeFromCart_onclick(event)">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
        `
        this.shadowRoot.innerHTML = "<style>" + style + "</style>" + html;
    }
}
customElements.define('cart-card', CartCard);