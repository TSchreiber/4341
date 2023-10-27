class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
                flex-direction: column;
                max-width: 30ch;
                gap: 4px;
                border: solid black 2px;
                border-radius: 8px;
                padding: 4px;
            }

            .image {
                height: 180px;
                object-fit: contain;
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
        this.shadowRoot.appendChild(style);

        let pimg = document.createElement("img");
        pimg.src = this.product.image_url;
        pimg.classList.add("image");
        this.shadowRoot.appendChild(pimg);

        let pname = document.createElement("h1");
        pname.innerText = this.product.name;
        pname.classList.add("name");
        this.shadowRoot.appendChild(pname);

        let pdesc = document.createElement("p");
        pdesc.innerText = this.product.description;
        pdesc.classList.add("description");
        this.shadowRoot.appendChild(pdesc);

        let pprice = document.createElement("h5");
        pprice.innerText = "$" + this.product.price/100.0;
        pprice.classList.add("price");
        this.shadowRoot.appendChild(pprice);

        this.addToCartButton = document.createElement("button");
        this.addToCartButton.innerText = "ADD TO CART";
        this.shadowRoot.appendChild(this.addToCartButton);
    }

    addEventListener(type, handler) {
        if (!this.isConnected) {
            setTimeout(() => this.addEventListener(type,handler), 0);
            return;
        }
        switch (type) {
            case "addToCart":
                this.addToCartButton.addEventListener("click", handler);
                break;

            default:
                super.addEventListener(type, handler);
        }
    }
}
customElements.define('product-card', ProductCard);