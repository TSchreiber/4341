class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
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
                flex-direction: column;
                max-width: 30ch;
                gap: 4px;
                border: solid black 2px;
                border-radius: 8px;
                padding: 4px;
            }

            .name {
                font-size: 1.4em;
                overflow: hidden;
                height: 2.15em;
            }

            .price {
                font-size: 1.15em;
            }

            .description {
                line-height: 1.15em;
                height: 4.6em;
                overflow: hidden;
            }

            button {
                cursor: pointer;
            }
        `;
        let html = `
            <h1 class="name">${this.product.name}</h1>
            <p class="description">${this.product.description}</p>
            <h5 class="price">$${this.product.price/100.0}</h5>
            <button onclick="handle_addToCart_onclick(event)">ADD TO CART</button>
        `
        this.shadowRoot.innerHTML = "<style>" + style + "</style>" + html;
    }
}
customElements.define('product-card', ProductCard);