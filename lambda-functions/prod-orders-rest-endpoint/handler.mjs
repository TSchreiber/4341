import crypto from "crypto";

export const createHandler = function(db) {
return async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
        "Access-Control-Allow-Credentials": "true"
    };

    try {
        switch (event.resource) {
        case "/orders":
            switch (event.httpMethod) {
            case "OPTIONS":
                body = "";
                headers["Allow"] = "OPTIONS, GET, POST";
                break;
            
            case "GET":
                body = db.getAllOrders();
                break;
            
            case "POST":
                let id_token_str = event.headers.authorization.split(" ")[1];
                let id_token = JSON.parse(Buffer.from(id_token_str.split('.')[1], 'base64').toString());
                if (!id_token || !id_token.sub || !id_token.email_verified) {
                    statusCode = 403;
                    break;
                }

                let orderRequest = JSON.parse(event.body);
                let order = {};
                order.OrderId = crypto.randomUUID();
                order.user_id = id_token.sub;
                order.timestamp = Date.now();
                
                let promises = [];
                for (let PLU of orderRequest.items) {
                    promises.push(new Promise(async (res,rej) => {
                        try {
                            let item = await db.getProductByPLU(PLU);
                            res({"PLU": item.PLU, "price": item.price});
                        } catch (err) {
                            rej(err);
                        }
                    }))
                }
                order.items = await Promise.all(promises)

                // Basic card validation - these are the minimum requirements for a 
                // a card to possibly be valid, but does not fully verify that 
                // the card is valid
                let paymentInfo = orderRequest.paymentInfo;
                if (!paymentInfo) {
                    statusCode = 400;
                    break;
                }
                let PAN = paymentInfo.cardNumber;
                let cvc = paymentInfo.securityCode;
                let nameOnCard = paymentInfo.nameOnCard;
                let expiration = paymentInfo.expiration;
                if (!PAN || !cvc || !nameOnCard || !expiration) {
                    statusCode = 400;
                    break;
                }

                if (PAN.length < 8 || PAN.length > 19) {
                    statusCode = 400;
                    break;
                }
                let luhnSum = PAN.split("")
                    .reverse()
                    .map(s => parseInt(s))
                    .map((x,i) => i%2 == 0 ? x : x*2)
                    .reduce((sum,x) => sum+x, 0);
                if (luhnSum % 10 != 0) {
                    statusCode = 400;
                    break;
                }

                let [_,month,year] = 
                    expiration.match("^(\\d{2})/(\\d{2})$") ||
                    expiration.match("^(\\d{2})/(\\d{4})$");
                // Did not use,
                // > `new Date(year, monthIndex)`
                // Because it considers year 20 to be 1920
                if (new Date(`${month}/01/${year}`) < new Date()) {
                    statusCode = 400;
                    break;
                }
                
                // This is were the card information would be verified and the
                // payment process would be started with some payment api like stripe
                
                order.paymentInfo = {};
                // Only save the last four digits of the PAN to meet PCI Data Security Standard
                order.paymentInfo.cardNumber = PAN.substring(PAN.length - 4);

                order.shippingAddress = orderRequest.shippingAddress;
                order.billingAddress = orderRequest.billingAddress;
                
                await db.insertOrder(order);

                body = JSON.stringify({"OrderId": order.OrderId});
                break;
            
            default:
                throw new Error(`Unsupported route: "${event.httpMethod} ${event.resource}"`);
            }
            break;
            
        case "/orders/{OrderId+}":
            switch(event.httpMethod) {
            case "OPTIONS":
                body = "";
                headers["Allow"] = "OPTIONS, GET, POST";
                break;
                
            case "GET":
                body = await db.getOrderById(event.pathParameters.OrderId);
                break;
                
            default:
                throw new Error(`Unsupported route: "${event.httpMethod} ${event.resource}"`);
            }
            break;
                
        default:
            throw new Error(`Unsupported route: "${event.httpMethod} ${event.resource}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
}
