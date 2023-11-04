import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const db = {
    getProductByPLU: async function(PLU) {
        let res = await dynamo.send(
            new GetCommand({
                TableName: "Products",
                Key: { PLU },
            })
        );
        return res.Item;
    },

    getAllOrders: async function() {
        let res = await dynamo.send(
            new ScanCommand({ TableName: "Orders" })
        );
        return res.Items;
    },

    getAllOrdersForUser: async function(user_id) {
        let res = await dynamo.send(
            new ScanCommand({ TableName: "Orders" })
        );
        return res.Items.filter(order => order.user_id == user_id);
    },

    getOrderById: async function(orderId, user_id) {
        let res = await dynamo.send(
            new GetCommand({
                TableName: "Orders",
                Key: {
                    OrderId: orderId,
                    user_id: user_id
                }
            })
        );
        return res.Item;
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

import { createHandler } from "./handler.mjs";
export const handler = createHandler(db);

