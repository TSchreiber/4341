import {Orders} from "/modules/ordersAPI.js";

document.getElementById("place-order-button")
.addEventListener("click", () => {
    document.getElementById("place-order-button").disabled = true;
    let shippingAddress = formToObject("shipping-address-form");
    let paymentInfo = formToObject("payment-form");
    let billingAddress = formToObject("billing-address-form");
    createOrder(shippingAddress, paymentInfo, billingAddress)
});

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
    let items = sessionStorage.getItem("cart");
    let order = {
        shippingAddress,
        paymentInfo,
        billingAddress,
        items
    }
    Orders.post(order)
    .then(OrderID => {
        sessionStorage.removeItem("cart");
        window.location = `/order.html?OrderId=${OrderId}`;
    });
}
