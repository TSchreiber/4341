import db from "../server/db.mjs"
import { createHandler as createOrderHandler } from "../lambda-functions/prod-orders-rest-endpoint/handler.mjs";
const handleOrderRequest = createOrderHandler(db);
import { createHandler as createProductHandler } from "../lambda-functions/prod-products-rest-endpoint/handler.mjs";
const handleProductRequest = createProductHandler(db);
import assert from "assert";
import fs from "fs";
import { test_data } from "./test_data.mjs"

describe('Sending a POST request to the /orders endpoint', () => {
    describe('with a valid request', () => {
        it("should return the order id of the created order", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_data.valid_id_tokens[0]
                },
                body: JSON.stringify(test_data.valid_orders[0])
            });

            assert(res.statusCode == 200);
            assert(JSON.parse(res.body));
        });
    });

    describe("with an invalid authentication token should return a \"403 - Forbidden\" status", () => {
        it("when the user id is not provided", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_data.invalid_id_tokens.user_id_not_provided
                },
                body: JSON.stringify(test_data.valid_orders[0])
            });

            if (res.statusCode != 403) {
                throw new Error(`Expected "403" status code, but got "${res.statusCode}"`);
            }
        });

        it("when the user's email is not verified", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_data.invalid_id_tokens.email_not_verified
                },
                body: JSON.stringify(test_data.valid_orders[0])
            });

            if (res.statusCode != 403) {
                throw new Error(`Expected "403" status code, but got "${res.statusCode}"`);
            }
        });
    });

    describe("with an invalid order request should return a \"400 - Bad Request\" status", () => {
        it("when either address does not contain \"name\", \"mailingAddress1\", \"city\", and \"zip\"", async () => {
            for (let address of test_data.invalid_addresses) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: address,
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: test_data.valid_payment_methods[0],
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            }
        });

        it("when the items array is \"undefined\", \"null\", or empty", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_data.valid_id_tokens[0]
                },
                body: JSON.stringify({
                    shippingAddress: test_data.valid_addresses[0],
                    billingAddress: test_data.valid_addresses[0],
                    paymentInfo: test_data.valid_payment_methods[0],
                    items: test_data.invalid_item_PLUs
                })
            });
            if (res.statusCode != 400) {
                throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
            }
        });

        it("when paymentInfo does not contain \"cardNumber\", \"CVC\", \"nameOnCard\", and \"cardExpiration\"", async () => {
            for (let paymentMethod of test_data.invalid_payment_methods.missing_information) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: test_data.valid_addresses[0],
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: paymentMethod,
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            };
        });

        it("when cardNumber has less than 8 digits or more than 19 digits", async () => {
            for (let paymentMethod of test_data.invalid_payment_methods.incorrect_number_length) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: test_data.valid_addresses[0],
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: paymentMethod,
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            };
        });

        it("when cardNumber does not pass the Luhn algorithm check", async () => {
            for (let paymentMethod of test_data.invalid_payment_methods.invalid_number) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: test_data.valid_addresses[0],
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: paymentMethod,
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            };
        });

        it("when cardExpiration is not in the format \"MM/YY\", or \"MM/YYYY\"", async () => {
            for (let paymentMethod of test_data.invalid_payment_methods.invalid_expiration_format) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: test_data.valid_addresses[0],
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: paymentMethod,
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            }
        });

        it("when cardExpiration is in the past", async () => {
            for (let paymentMethod of test_data.invalid_payment_methods.expired_card) {
                let res = await handleOrderRequest({
                    resource: "/orders",
                    httpMethod: "POST",
                    headers: {
                        authorization: "Bearer " + test_data.valid_id_tokens[0]
                    },
                    body: JSON.stringify({
                        shippingAddress: test_data.valid_addresses[0],
                        billingAddress: test_data.valid_addresses[0],
                        paymentInfo: paymentMethod,
                        items: test_data.valid_item_PLUs
                    })
                });
                if (res.statusCode != 400) {
                    throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
                }
            }
        });

        it("when any item is not in the products catalog", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_data.valid_id_tokens[0]
                },
                body: JSON.stringify({
                    shippingAddress: test_data.valid_addresses[0],
                    billingAddress: test_data.valid_addresses[0],
                    paymentInfo: test_data.valid_payment_methods[0],
                    items: test_data.invalid_item_PLUs
                })
            });
            if (res.statusCode != 400) {
                throw new Error(`Expected "400" status code, but got "${res.statusCode}"`);
            }
        });
    });
});

describe("Sending a GET request to the /orders endpoint", () => {
    it("should return a \"403 - Forbidden\" status when the user id is not provided in the id token", async () => {
        let res = await handleOrderRequest({
            resource: "/orders",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.invalid_id_tokens.user_id_not_provided
            }
        });

        if (res.statusCode != 403) {
            throw new Error(`Expected "403" status code, but got "${res.statusCode}"`);
        }
    });

    it ("should return all orders created by the user", async () => {
        let res = await handleOrderRequest({
            resource: "/orders",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.valid_id_tokens[0]
            }
        });
        
        if (res.statusCode != 200) {
            throw new Error(`Expected "200" status code, but got "${res.statusCode}"`);
        }
        let orders = JSON.parse(res.body);
        if (orders.length <= 0) {
            throw new Error(`Returned empty array`);
        } else if (!orders[0].OrderId) {
            throw new Error(`Did not return the correct orders, ${res.body}`);
        }
    });

    it ("should not return any orders created by another user", async () => {
        let res = await handleOrderRequest({
            resource: "/orders",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.valid_id_tokens[0]
            }
        });
        
        if (res.statusCode != 200) {
            throw new Error(`Expected "200" status code, but got "${res.statusCode}"`);
        }
        let orders = JSON.parse(res.body);
        for (let order of orders) {
            if (order.user_id != "e586c8b1-59aa-4c05-bfcc-58a4e18e5902") {
                throw new Error(`Recieved an order from another user, ${res.body}`);
            }
        }
    });
});

describe("Sending a GET request to the /orders/{OrderId+} endpoint", () => {
    it("should return a \"403 - Forbidden\" status when the user id is not provided in the id token", async () => {
        let res = await handleOrderRequest({
            resource: "/orders/{OrderId+}",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.invalid_id_tokens.user_id_not_provided
            },
            pathParameters: {
                OrderId: test_data.valid_order_ids[0]
            }
        });

        if (res.statusCode != 403) {
            throw new Error(`Expected "403" status code, but got "${res.statusCode}"`);
        }
    });
    it("should return a \"403 - Forbidden\" status when the user is not the owner of the order", async () => {
        let res = await handleOrderRequest({
            resource: "/orders{OrderId+}",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.valid_id_tokens[1]
            },
            pathParameters: {
                OrderId: test_data.valid_order_ids[0]
            }
        });

        if (res.statusCode != 403) {
            throw new Error(`Expected "403" status code, but got "${res.statusCode}"`);
        }
    });

    it ("should return the specified order when the request is valid", async () => {
        let res = await handleOrderRequest({
            resource: "/orders/{OrderId+}",
            httpMethod: "GET",
            headers: {
                authorization: "Bearer " + test_data.valid_id_tokens[0]
            },
            pathParameters: {
                OrderId: "21636e24-d65c-4eb8-9477-50c2c4f5d735"
            }
        });

        if (res.statusCode != 200) {
            throw new Error(`Expected "200" status code, but got "${res.statusCode}"`);
        }
        if (JSON.parse(res.body).OrderId != "21636e24-d65c-4eb8-9477-50c2c4f5d735") {
            throw new Error(`Returned incorrect order, ${res.body}`);
        }
    });
});
