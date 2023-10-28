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

    getAllProducts: async function() {
        return await dynamo.send(
            new ScanCommand({ TableName: "Products" })
        ).Items;
    },
};

const { createHandler } = import handler;
export const handler = createHandler(db);

