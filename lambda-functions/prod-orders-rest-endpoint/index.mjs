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

const db = {
    getProductByPLU: async function(PLU) {
        await dynamo.send(
            new GetCommand({
                TableName: "Products",
                Key: { PLU },
            })
        ).Item;
    },

    getAllOrders: async function() {
        return await dynamo.send(
            new ScanCommand({ TableName: "Orders" })
        ).Items;
    },

    getOrderById: async function(orderId) {
        return await dynamo.send(
            new GetCommand({
                TableName: "Orders",
                Key: {
                    OrderId: orderId,
                }
            });
        ).Item;
    },

    insertOrder: async function(order) {
        await dynamo.send(
            new PutCommand({
                TableName: "Orders",
                Item: order,
            })
        );
    },
};

const { createHandler } = import handler;
export const handler = createHandler(db);

