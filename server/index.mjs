import db from "./db.mjs";
import express from "express";
const app = express();
import { createHandler as createOrderHandler } from "../lambda-functions/prod-orders-rest-endpoint/handler.mjs";
const handleOrderRequest = createOrderHandler(db);
import { createHandler as createProductHandler } from "../lambda-functions/prod-products-rest-endpoint/handler.mjs";
const handleProductRequest = createProductHandler(db);

app.use(express.json());
app.use(express.static("front-end"));

app.get("/products", async (req,res) => {
    let { statusCode, headers, body } = 
        await handleProductRequest({
            resource: "/products",
            httpMethod: "GET",
        });
    res.status(statusCode);
    res.set(headers);
    res.send(body);
});

app.get("/products/:PLU", async (req,res) => {
    let { statusCode, headers, body } = 
        await handleProductRequest({
            resource: "/products/{PLU+}",
            httpMethod: "GET",
            pathParameters: req.params,
        });
    res.status(statusCode);
    res.set(headers);
    res.send(body);
});

app.get("/orders", async (req,res) => {
    let { statusCode, headers, body } = 
        await handleOrderRequest({
            resource: "/orders",
            httpMethod: "GET",
            headers: req.headers,
        });
    res.status(statusCode);
    res.set(headers);
    res.send(body);
});

app.post("/orders", async (req,res) => {
    let { statusCode, headers, body } = 
        await handleOrderRequest({
            resource: "/orders",
            httpMethod: "POST",
            body: JSON.stringify(req.body),
            headers: req.headers,
        });
    res.status(statusCode);
    res.set(headers);
    res.send(body);
});

app.get("/orders/:OrderId", async (req,res) => {
    let { statusCode, headers, body } = 
        await handleOrderRequest({
            resource: "/orders/{OrderId+}",
            httpMethod: "GET",
            pathParameters: req.params,
            headers: req.headers,
        });
    res.status(statusCode);
    res.set(headers);
    res.send(body);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
