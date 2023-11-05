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
    let items = JSON.parse(sessionStorage.getItem("cart"))
    let order = {
        shippingAddress,
        paymentInfo,
        billingAddress,
        items
    }
    Orders.post(order)
    .then(body => {
        sessionStorage.removeItem("cart");
        let OrderId = body.OrderId;
        window.location = `/order.html?OrderId=${OrderId}`;
    });
}

var cardInputElement = document.getElementById("card-number");
cardInputElement.addEventListener("input", (event) => {
    let start = cardInputElement.selectionStart;
    let end = cardInputElement.selectionEnd;
    if (event.inputType == "deleteContentBackward") {
        //handle backspace
        if (start == end && start % 5 == 4) {
            // if the user has selected multiple characters, or is not deleting
            // a space, then nothing needs to be done
            let text = cardInputElement.value;
            text = text.slice(0,start-1) + text.slice(start);
            // redo the spaces
            text = text.replaceAll(" ","");
            text = text.replace(/(\d{4})/g, "$& ");
            cardInputElement.value = text;
            cardInputElement.selectionStart = start - 1;
            cardInputElement.selectionEnd = end - 1;
        }
    } else if (event.inputType == "deleteContentForward") {
        //handle delete
        if (start == end && start % 5 == 4) {
            // if the user has selected multiple characters, or is not deleting
            // a space, then nothing needs to be done
            let text = cardInputElement.value;
            text = text.slice(0,start+1) + text.slice(start+2);
            // redo the spaces
            text = text.replaceAll(" ","");
            text = text.replace(/(\d{4})/g, "$& ");
            cardInputElement.value = text;
            cardInputElement.selectionStart = start;
            cardInputElement.selectionEnd = end;
        }
    } else {
        let num = cardInputElement.value;
        // remove all non-digit characters
        num = num.replace(/[^\d]+/g, "");
        // add a space after every group of four digits
        num = num.replace(/(\d{4})/g, "$& ");
        cardInputElement.value = num;
        if (event.inputType == "insertText") {
            cardInputElement.selectionStart = end+1;
            cardInputElement.selectionEnd = end+1;
        }
    }
});

