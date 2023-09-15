function loadProducts() {
    api_url = "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com";
    fetch(api_url+"/Prod/products")
    .then(res_raw => res_raw.json())
    .then(res => populateProducts(res));
}

async function loadProductByPLU(PLU) {
    api_url = "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com";
    let res_raw = await fetch(api_url+"/Prod/products/"+PLU);
    return await res_raw.json();
}

function populateProducts(products) {
    let productsContainer = document.getElementById("products-container");
    for (product of products) {
        let card = createProductCard(product);
        productsContainer.appendChild(card);
    }
    let loadProdButton = document.getElementById("load-products-button");
    if (loadProdButton) loadProdButton.style.display = "none";
}

function createProductCard(product) {
    let card = document.createElement("product-card");
    card.setAttribute("data-product", JSON.stringify(product));
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
        this.cartContentsElement.appendChild(cartCardEl);
        this.onStateUpdated();
    },

    remove: function(item, element) {
        let i = this.items.findIndex(x => x === item);
        this.items.splice(i,1);
        this.domElement.setAttribute("data-count", this.items.length);
        this.cartContentsElement.setAttribute("data-count", this.items.length);
        this.cartContentsElement.removeChild(element);
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
            .reduce((sum, x) => sum + x);
        this.cartSummaryTotalElement.innerText = `Subtotal: $${total/100.0}`;
    },
}

function handle_addToCart_onclick(event) {
    let host = event.target.getRootNode().host;
    let product = JSON.parse(host.getAttribute("data-product"));
    cart.add(product);
}

function handle_removeFromCart_onclick(event) {
    let host = event.target.getRootNode().host;
    let product = JSON.parse(host.getAttribute("data-product"));
    cart.remove(product, host);
}

function handle_cart_onclick(event) {

}

function handle_proceedToCheckout_onclick(event) {
    if (!userIsAuthenticated) {
        document.getElementById("login-button").click();
        return;
    }
    document.getElementById("product-browser-page").style.display = "none"
    document.getElementById("checkout-page").style.display = "block";
    history.pushState(null, null, "checkout");
}

function handle_backToProductBrowser_onclick(event) {
    history.back();
}

function handle_placeOrder_onclick(event) {
    let shippingAddress = formToObject("shipping-address-form");
    let paymentInfo = formToObject("payment-form");
    let billingAddress = formToObject("billing-address-form");
    createOrder(shippingAddress, paymentInfo, billingAddress)
}

function formToObject(formId) {
    let obj = {}
    new FormData(document.getElementById(formId))
        .forEach((v,k) => obj[dashedToCamelCase(k)] = v);
    return obj;
}

function dashedToCamelCase(str) {
    let parts = str.split("-");
    for (let i=1; i<parts.length; i++) {
        parts[i] = parts[i].substring(0,1).toUpperCase() + 
            parts[i].substring(1).toLowerCase();
    }
    return parts.join("");
}

function createOrder(shippingAddress, paymentInfo, billingAddress) {
    if (billingAddress.useShippingAddress) {
        billingAddress = shippingAddress;
    } else {
        delete billingAddress.useShippingAddress;
    }
    let items = cart.items.map(i => {return {PLU: i.PLU, price: i.price}});
    let order = {
        shippingAddress,
        paymentInfo,
        billingAddress,
        items
    }
    fetch("https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod/orders", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(orderConfirmation => console.log(orderConfirmation));
}

window.onpopstate = function(event) {
    event.preventDefault = true;
    document.getElementById("product-browser-page").style.display = ""
    document.getElementById("checkout-page").style.display = "none";
}

if (userIsAuthenticated) {
    document.body.setAttribute("data-authenticated", "true");
} 

if (sessionStorage.getItem("cart")) {
    let items = JSON.parse(sessionStorage.getItem("cart"));
    for (let item of items) {
        loadProductByPLU(item)
           .then(item => cart.add(item));
    }
}

loadProducts();