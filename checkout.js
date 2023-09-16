document.getElementById("place-order-button")
.addEventListener("click", () => {
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
    // fetch("https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod/orders", {
    //     method: "POST",
    //     headers: {
    //         "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(order)
    // })
    // .then(res => res.json())
    // .then(orderConfirmation => showOrderConfirmation(orderConfirmation));
    let orderConfirmation = JSON.parse(`{"shippingAddress":{"firstName":"","middleName":"","lastName":"","mailingAddress1":"","mailingAddress2":"","city":"","state":"","zip":"","urbanization":""},"paymentInfo":{"nameOnCard":"","cardNumber":"","securityCode":"","expiration":""},"billingAddress":{"firstName":"","middleName":"","lastName":"","mailingAddress1":"","mailingAddress2":"","city":"","state":"","zip":"","urbanization":""},"items":[{"PLU":"961947050502","price":119999}],"OrderId":"3f59a337-9d96-4ce6-88ab-4a47c474e046"}`);
    showOrderConfirmation(orderConfirmation);
}

// let orderConfirmation = JSON.parse(`{"shippingAddress":{"firstName":"","middleName":"","lastName":"","mailingAddress1":"","mailingAddress2":"","city":"","state":"","zip":"","urbanization":""},"paymentInfo":{"nameOnCard":"","cardNumber":"","securityCode":"","expiration":""},"billingAddress":{"firstName":"","middleName":"","lastName":"","mailingAddress1":"","mailingAddress2":"","city":"","state":"","zip":"","urbanization":""},"items":[{"PLU":"961947050502","price":119999}],"OrderId":"3f59a337-9d96-4ce6-88ab-4a47c474e046"}`);
// setTimeout(showOrderConfirmation(orderConfirmation), 1);

function showOrderConfirmation(orderConfirmation) {
    console.log(orderConfirmation);
}
