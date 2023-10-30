const test_id_token = "eyJraWQiOiJnMVNpYjNpS05Tb1ZXYlZcL1Z5Ykl5cFwvbjJjYnNOaFRrdTJxcXRiUEhySTA9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiSWpqVkZad1UyenpXMUVDa0E2cHFEQSIsInN1YiI6ImU1ODZjOGIxLTU5YWEtNGMwNS1iZmNjLTU4YTRlMThlNTkwMiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9XcWRoZEdQSXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiZTU4NmM4YjEtNTlhYS00YzA1LWJmY2MtNThhNGUxOGU1OTAyIiwib3JpZ2luX2p0aSI6IjhhNDdjNGY4LWEyYzUtNDJhMS1hMDE2LWQ3ZTBmOWIwMzBkMyIsImF1ZCI6IjRwdHZsb2NlZ2UwajNpcmV1a29lODNqbTF1IiwiZXZlbnRfaWQiOiIyMDNjOGE5Yi1mN2NhLTQ1OTItODI3Yy1mMWRjYWI5NjZlNTkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5ODUyMzM5OCwiZXhwIjoxNjk4NTI2OTk4LCJpYXQiOjE2OTg1MjMzOTgsImp0aSI6IjAxZGJjNjgyLWExZGEtNDcwMS1iZThhLWUwYjkyMzAyMTgxYiIsImVtYWlsIjoidGRzMTgwMDAxQHV0ZGFsbGFzLmVkdSJ9.i-NtNjmjGSsyHd9DCOdYKJGZ4R8G7K-3w6rvaVNU9FaCG6HwdoF5TNuvuUPcBlgK_VPJXZOSjybn2fEvuemheD6KOKLznRGXj1QUJqakcCtG-Nh2hpSSPvBwM61J112P-oqHSVUjfLK4JI-fcnCdfb6KzqK5r_3W7GojaWMJRnaAU3lXmPnAKznqtMVxDJnZDBVCJ3lPSbXdrufdXwFdWT-bRM3djgvt33ZO_5J9nOuD74uJBcl-2GZJRp23HOgGGC1Gqr6wu2K6Nw6c_jaKcKKjMItfp_ziVYIdSCHoOUl7tALuXfaaFp7CQSXf7gq0PWzuDmVJv2ZpA4mgcc5cqg";

import db from "../server/db.mjs"
import { createHandler as createOrderHandler } from "../lambda-functions/prod-orders-rest-endpoint/handler.mjs";
const handleOrderRequest = createOrderHandler(db);
import { createHandler as createProductHandler } from "../lambda-functions/prod-products-rest-endpoint/handler.mjs";
const handleProductRequest = createProductHandler(db);
import assert from "assert";

describe('orders endpoint', () => {
    describe('posting an order', () => {
        it("should return the order id of the created order", async () => {
            let res = await handleOrderRequest({
                resource: "/orders",
                httpMethod: "POST",
                headers: {
                    authorization: "Bearer " + test_id_token
                },
                body: JSON.stringify({
                    shippingAddress: {
                        firstName: 'John',
                        middleName: '',
                        lastName: 'Doe',
                        mailingAddress1: '800 W Campbell Rd',
                        mailingAddress2: '',
                        city: 'Richardson',
                        state: 'TX',
                        zip: '75080',
                        urbanization: ''
                    },
                    paymentInfo: {
                        nameOnCard: 'John Doe',
                        cardNumber: '4111111111111111',
                        securityCode: '111',
                        expiration: '01/2030'
                    },
                    billingAddress: {
                        firstName: 'John',
                        middleName: '',
                        lastName: 'Doe',
                        mailingAddress1: '800 W Campbell Rd',
                        mailingAddress2: '',
                        city: 'Richardson',
                        state: 'TX',
                        zip: '75080',
                        urbanization: ''
                    },
                    items: [ '982038352481' ]
                })
            });

            assert(res.statusCode == 200);
            assert(JSON.parse(res.body));
        });
    });
});

