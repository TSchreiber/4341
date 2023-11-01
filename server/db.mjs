import sqlite3 from 'sqlite3';
import { readFileSync } from "fs";
const createSchemaSQL = readFileSync("database/createSchema.sql").toString();

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.exec(createSchemaSQL);
});

export default {
    getAllProducts: function() {
        return new Promise(res => {
            db.all("select * from Products", (err,row) => res(row));
        });
    },

    getProductByPLU: function(PLU) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("select * from Products where PLU=?");
            stmt.get(PLU, (err,row)=>{
                if (err) rej(err);
                else res(row);
            });
            stmt.finalize(res);
        });
    },

    getAllOrders: async function() {
        return new Promise((res,rej) => {
            db.all("select * from Orders", (err,row) => {
                if (err) {
                    rej(err);
                } else {
                    res(row);
                }
            });
        });
    },

    getAllOrdersForUser: function(user_id) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("select * from Orders where user_id=?");
            stmt.all(user_id, (err,row) => {
                if (err) rej(err);
                else res(row);
            });
        });
    },

    getOrderItems: function(orderId) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("select * from OrderItem where OrderId=?");
            stmt.all(orderId, (err,row) => {
                if (err) rej(err);
                else res(row);
            });
        });
    },

    getOrderById: async function(orderId) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("select * from Orders where OrderId=?");
            stmt.get(orderId, async (err,row)=>{
                if (err) {
                    rej(err);
                } else {
                    let order = row;
                    
                    order.items = (await this.getOrderItems(orderId))
                        .map(item => { return {PLU: item.PLU, price: item.unitPrice}; });

                    order.paymentInfo = {cardNumber: order.cardNumber};
                    delete order.cardNumber;

                    order.shippingAddress = await this.getAddressById(order.shippingAddressId);
                    order.shippingAddress.mailingAddress1 = order.shippingAddress.addressLine1;
                    order.shippingAddress.mailingAddress2 = order.shippingAddress.addressLine2;
                    delete order.shippingAddress.addressLine1;
                    delete order.shippingAddress.addressLine2;

                    order.billingAddress = await this.getAddressById(order.billingAddressId);
                    order.billingAddress.mailingAddress1 = order.billingAddress.addressLine1;
                    order.billingAddress.mailingAddress2 = order.billingAddress.addressLine2;
                    delete order.billingAddress.addressLine1;
                    delete order.billingAddress.addressLine2;

                    delete order.shippingAddress.addressId;
                    delete order.billingAddress.addressId;

                    res(order);
                }
            });
        });
    },

    getAddressById: function(addressId) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("select * from Address where addressId=?");
            stmt.get(addressId, (err,row) => {
                if (err) rej(err);
                else res(row);
            });
        });
    },

    insertAddress: function(address) {
        return new Promise((res,rej) => {
            const stmt = db.prepare("insert into Address (firstName, middleName, lastName, addressLine1, addressLine2, city, state, zip, urbanization) values (?,?,?,?,?,?,?,?,?)");
            stmt.run(
                address.firstName, 
                address.middleName, 
                address.lastName, 
                address.addressLine1, 
                address.addressLine2, 
                address.city, 
                address.state, 
                address.zip, 
                address.urbanization, 
                (err) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(stmt.lastID);
                    }
                }
            );
        });
    },

    insertOrder: function(order) {
        return new Promise(async (res,rej) => {
            try {
                order.billingAddress.addressLine1 = order.billingAddress.mailingAddress1;
                order.billingAddress.addressLine2 = order.billingAddress.mailingAddress2;
                delete order.billingAddress.mailingAddress1;
                delete order.billingAddress.mailingAddress2;
                let billingAddressId = await this.insertAddress(order.billingAddress);

                order.shippingAddress.addressLine1 = order.shippingAddress.mailingAddress1;
                order.shippingAddress.addressLine2 = order.shippingAddress.mailingAddress2;
                delete order.shippingAddress.mailingAddress1;
                delete order.shippingAddress.mailingAddress2;
                let shippingAddressId = await this.insertAddress(order.shippingAddress);

                let stmt = db.prepare("insert into Orders (OrderId,user_id,shippingAddressId,billingAddressId,cardNumber,timestamp) values (?,?,?,?,?,?)");
                stmt.run(
                    order.OrderId,
                    order.user_id,
                    shippingAddressId,
                    billingAddressId,
                    order.paymentInfo.cardNumber,
                    order.timestamp,
                    (err) => {
                        if (err) {
                            rej(err);
                        } else {
                            res();
                        }
                    }
                );

                for (let item of order.items) {
                    stmt = db.prepare("insert into OrderItem (OrderId,PLU,unitPrice) values (?,?,?)");
                    stmt.run(order.OrderId, item.PLU, item.price, err => {
                        if (err) console.error(err);
                    });
                }
            } catch (err) {
                rej(err);
            }
        });
    },

    close: (callback) => db.close(callback),
};

