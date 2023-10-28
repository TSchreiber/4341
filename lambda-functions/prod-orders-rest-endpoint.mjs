import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Orders";

export const handler = async (event, context) => {
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
                body = await dynamo.send(
                    new ScanCommand({ TableName: tableName })
                );
                body = body.Items;
                break;
            
            case "POST":
                let order = JSON.parse(event.body);
                order.OrderId = crypto.randomUUID();
                let id_token_str = event.headers.Authorization.split(" ")[1];
                let id_token = JSON.parse(Buffer.from(id_token_str.split('.')[1], 'base64').toString());
                order.user_id = id_token["cognito:username"];
                order.timestamp = Date.now();
                
                let promises = [];
                for (let PLU of order.items) {
                    promises.push(new Promise(res => {
                        dynamo.send(
                            new GetCommand({
                                TableName: "Products",
                                Key: { PLU },
                            })
                        )
                        .then(body => {
                            let item = body.Item;
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
                
                await dynamo.send(
                    new PutCommand({
                        TableName: tableName,
                        Item: order,
                    })
                );
                
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
                body = await dynamo.send(
                    new GetCommand({
                        TableName: tableName,
                        Key: {
                            OrderId: event.pathParameters.OrderId,
                        },
                    })
                );
                body = body.Item;
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