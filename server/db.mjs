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
        return new Promise(res => {
            db.all("select * from Orders", (err,row) => res(row));
        });
    },

    getOrderById: async function(orderId) {
        return new Promise(res => {
            const stmt = db.prepare("select * from Order where orderId=?");
            stmt.get(orderId, (err,row)=>{
                if (err) rej(err);
                else res(row);
            });
            stmt.finalize(res);
        });
    },

    insertOrder: function(order) {
        return new Promise(res => {
            const stmt = db.prepare("insert into Orders values (?)");
            stmt.run(order.orderId);
            stmt.finalize(res);
        });
    },

    close: (callback) => db.close(callback),
};

