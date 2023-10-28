import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Products";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Credentials": "true"
    };

    try {
        switch (event.resource) {
            case "/products":
                switch (event.httpMethod) {
                    case "OPTIONS":
                        body = "";
                        headers["Allow"] = "OPTIONS, GET";
                        break;
                    
                    case "GET":
                        body = await dynamo.send(
                          new ScanCommand({ TableName: tableName })
                        );
                        body = body.Items;
                        break;
                  
                    default:
                        throw new Error(`Unsupported route: "${event.httpMethod} ${event.resource}"`);
                }
                break;
            
            case "/products/{PLU+}":
                switch (event.httpMethod) {
                    case "OPTIONS":
                        body = "";
                        headers["Allow"] = "OPTIONS, GET";
                        break;
                    
                    case "GET":
                        body = await dynamo.send(
                            new GetCommand({
                                TableName: tableName,
                                Key: {
                                    PLU: event.pathParameters.PLU,
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