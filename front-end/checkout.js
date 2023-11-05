import {Orders} from "/modules/ordersAPI.js";

document.getElementById("place-order-button")
.addEventListener("click", () => {
    if (!formIsValid()) {
        return false;
    }
    document.getElementById("place-order-button").disabled = true;
    let shippingAddress = formToObject("shipping-address-form");
    let paymentInfo = formToObject("payment-form");
    let billingAddress = formToObject("billing-address-form");
    createOrder(shippingAddress, paymentInfo, billingAddress)
});

function formIsValid() {
    for (let input of getAllFormInputs()) {
        if (!input.reportValidity()) {
            return false;
        }
    }
    return true;
}

function getAllFormInputs() {
    let forms = ["shipping-address-form","payment-form"];
    if (!document.getElementById("use-shipping-address").checked) {
        forms.push("billing-address-form");
    }
    return forms.flatMap(id => [...getFormInputs(id)]);
}

function getFormInputs(formId) {
    return document.getElementById(formId)
        .querySelectorAll("input,select");
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
    let items = JSON.parse(sessionStorage.getItem("cart"))
    let order = {
        shippingAddress,
        paymentInfo,
        billingAddress,
        items
    }
    order.paymentInfo.cardNumber = order.paymentInfo.cardNumber.replaceAll(" ","");
    Orders.post(order)
    .then(body => {
        sessionStorage.removeItem("cart");
        let OrderId = body.OrderId;
        window.location = `/order.html?OrderId=${OrderId}`;
    });
}

var cardInputElement = document.getElementById("card-number");
cardInputElement.addEventListener("beforeinput", (event) => {
    if (event.data?.match(/[^\d]/)) {
        event.preventDefault();
    }

    if (event.inputType.includes("delete")) {
        if (event.inputType.includes("Backward")) {
            let index = cardInputElement.selectionEnd;
            let text = cardInputElement.value;
            if (text.charAt(index-1) == " ") {
                cardInputElement.selectionStart = index - 1;
                cardInputElement.selectionEnd = index - 1;
            }
        } else if (event.inputType.includes("Forward")) {
            let index = cardInputElement.selectionEnd;
            let text = cardInputElement.value;
            if (text.charAt(index) == " ") {
                cardInputElement.selectionStart = index + 1;
                cardInputElement.selectionEnd = index + 1;
            }
        }
    }
});

cardInputElement.addEventListener("input", (event) => {
    let index = cardInputElement.selectionEnd;
    let text = cardInputElement.value;
    text = text.replaceAll(" ","");
    /*
     * Go to the following link to see the chunking rules for different cards
     * https://baymard.com/checkout-usability/credit-card-patterns
     */
    // amex
    if (text.startsWith("34") || text.startsWith("37")) {
        if (text.length >= 10) {
            text = text.substring(0,4) + " " 
                 + text.substring(4,10) + " "
                 + text.substring(10);
        }
        else if (text.length >= 4) {
            text = text.substring(0,4) + " " 
                 + text.substring(4);
        } 
    }
    // default (most cards are chunked in groups of four)
    if (text.startsWith("4")) {
        text = text.replace(/(\d{4})/g, "$& ");
    } 
    cardInputElement.value = text;

    // don't leave the cursor on a space
    if (text.charAt(index) == " " && event.inputType.startsWith("insert")) {
            index += 1;
    } else if (text.charAt(index-1) == " " && event.inputType.startsWith("delete")) {
        index -= 1;
    }
    cardInputElement.selectionStart = index;
    cardInputElement.selectionEnd = index;
});

cardInputElement.addEventListener("input", (event) => {
    let PAN = cardInputElement.value.replaceAll(" ","");
    if (PAN.length < 8) {
        cardInputElement.setCustomValidity("Too few numbers");
        return;
    }
    if (PAN.length > 19) {
        cardInputElement.setCustomValidity("Too many numbers");
        return;
    }
    let luhnSum = PAN.split("")
        .reverse()
        .map(s => parseInt(s))
        .map((x,i) => i%2 == 0 ? x : x*2)
        .flatMap(x => x.toString().split(""))
        .map(s => parseInt(s))
        .reduce((sum,x) => sum+x, 0);
    if (luhnSum % 10 != 0) {
        cardInputElement.setCustomValidity("Could not validate card number");
        return;
    }
    cardInputElement.setCustomValidity("");
});

const expirationInputElement = document.getElementById("expiration");
expirationInputElement.addEventListener("beforeinput", (event) => {
    if (event.data?.match(/[^\d]/)) {
        event.preventDefault();
    }

    let text = expirationInputElement.value;
    let index = expirationInputElement.selectionEnd;
    if (event.inputType.includes("delete")) {
        if (event.inputType.includes("Backward")) {
            if (text.charAt(index-1) == "/") {
                expirationInputElement.selectionStart = index - 1;
                expirationInputElement.selectionEnd = index - 1;
            }
        } else if (event.inputType.includes("Forward")) {
            if (text.charAt(index) == "/") {
                expirationInputElement.selectionStart = index + 1;
                expirationInputElement.selectionEnd = index + 1;
            }
        }
    }
});

expirationInputElement.addEventListener("input", (event) => {
    let text = expirationInputElement.value.replace(/[^\d]/g,"");
    let index = expirationInputElement.selectionEnd;
    if (!["0","1"].includes(text.charAt(0)) && event.inputType.startsWith("insert")) {
        text = "0" + text;
        index += 1;
    }
    if (text.length == 2) {
        text += "/";
        index += 1;
    } else if (text.length >= 3) {
        text = text.substring(0,2) + "/" + text.substring(2);
    }
    expirationInputElement.value = text;

    expirationInputElement.selectionStart = index;
    expirationInputElement.selectionEnd = index;
});

expirationInputElement.addEventListener("input", (event) => {
    let expiration = expirationInputElement.value;
    let matches = 
        expiration.match("^(\\d{2})/(\\d{2})$") ||
        expiration.match("^(\\d{2})/(\\d{4})$");
    if (!matches) {
        expirationInputElement.setCustomValidity("Please use MM/YY or MM/YYYY format");
        return;
    }
    let [_,month,year] = matches;
    let date;
    date = new Date(`${month}/01/${year}`);
    if (date == "Invalid Date") {
        expirationInputElement.setCustomValidity("Invalid date");
        return;
    }
    // Did not use,
    // > `new Date(year, monthIndex)`
    // Because it considers year 20 to be 1920
    if (date < new Date()) {
        expirationInputElement.setCustomValidity("Card is expired");
        return;
    }
    expirationInputElement.setCustomValidity("");
});
