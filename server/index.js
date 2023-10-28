const { createDB } = require("./db");
const { readFileSync } = require("fs");
const createSchemaSQL = readFileSync("database/createSchema.sql").toString();
const db = createDB(createSchemaSQL);
db.close();
