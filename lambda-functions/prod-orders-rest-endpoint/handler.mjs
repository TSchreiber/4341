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
                let order = JSON.parse(event.body);
                order.OrderId = crypto.randomUUID();
                let id_token_str = event.headers.authorization.split(" ")[1];
                let id_token = JSON.parse(Buffer.from(id_token_str.split('.')[1], 'base64').toString());
                order.user_id = id_token["cognito:username"];
                order.timestamp = Date.now();
                
                let promises = [];
                for (let PLU of order.items) {
                    promises.push(new Promise(res => {
                        db.getProductByPLU(PLU)
                        .then(item => {
                            res({"PLU": item.PLU, "price": item.price});
                        })
                    }))
                }
                order.items = await Promise.all(promises)
                
                // This is were the card information would be verified and the
                // payment process would be started with some payment api like stripe
                
                // Then remove the card information
                order.paymentInfo.cardNumber = order.paymentInfo.cardNumber.substring(12);
                delete order.paymentInfo.securityCode;
                delete order.paymentInfo.expiration;
                delete order.paymentInfo.nameOnCard;
                
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
