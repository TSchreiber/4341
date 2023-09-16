import {auth} from "/modules/auth.js";
import {Products} from "/modules/productsAPI.js"

function populateProducts(products) {
    let productsContainer = document.getElementById("products-container");
    for (let product of products) {
        let card = createProductCard(product);
        productsContainer.appendChild(card);
    }
    let loadProdButton = document.getElementById("load-products-button");
    if (loadProdButton) loadProdButton.style.display = "none";
}

function createProductCard(product) {
    let card = document.createElement("product-card");
    card.setAttribute("data-product", JSON.stringify(product));
    card.addEventListener("addToCart", () => cart.add(product));
    return card;
}

const cart = {
    domElement: document.getElementById("cart"),
    cartContentsElement: document.getElementById("cart-contents-panel"),
    cartSummaryCountElement: document.getElementById("cart-summary--count"),
    cartSummaryTotalElement: document.getElementById("cart-summary--total"),
    items: [],

    add: function(item) {
        this.items.push(item);
        this.domElement.setAttribute("data-count", this.items.length);
        this.cartContentsElement.setAttribute("data-count", this.items.length);
        let cartCardEl = document.createElement("cart-card");
        cartCardEl.setAttribute("data-product", JSON.stringify(item));
        cartCardEl.addEventListener("removeFromCart", () => cart.remove(item));
        this.cartContentsElement.appendChild(cartCardEl);
        this.onStateUpdated();
    },

    remove: function(item, element) {
        let i = this.items.findIndex(x => x === item);
        this.items.splice(i,1);
        this.domElement.setAttribute("data-count", this.items.length);
        this.cartContentsElement.setAttribute("data-count", this.items.length);
        this.cartContentsElement.removeChild(this.cartContentsElement.children[i+1]);
        this.onStateUpdated();
    },

    onStateUpdated: function() {
        this.updateSummary();
        sessionStorage.setItem("cart", JSON.stringify(this.items.map(p => p.PLU)));
    },

    updateSummary: function() {
        this.cartSummaryCountElement.innerText = `Items: ${this.items.length}`;
        let total = 
            this.items
            .map(i => i.price)
            .reduce((sum, x) => sum + x, 0);
        this.cartSummaryTotalElement.innerText = `Subtotal: $${total/100.0}`;
    },
}

document.getElementById("proceed-to-checkout-button")
.addEventListener("click", () =>{
    if (!auth.isAuthenticated()) {
        auth.login(window.location.origin + "/checkout.html")
    } else {
        window.location = window.location.origin + "/checkout.html";
    }
});

document.getElementById("login-button")
.addEventListener("click", () => auth.login());

if (auth.isAuthenticated()) {
    document.body.setAttribute("data-authenticated", "true");
} 

if (sessionStorage.getItem("cart")) {
    let items = JSON.parse(sessionStorage.getItem("cart"));
    for (let item of items) {
        Products.getByPLU(item)
            .then(item => cart.add(item));
    }
}

Products.getAllProducts()
    .then(populateProducts);