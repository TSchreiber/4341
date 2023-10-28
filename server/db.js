const sqlite3 = require('sqlite3').verbose();

function createDB(schemaSQL) {
    const db = new sqlite3.Database(':memory:');
    db.serialize(() => {
        db.exec(createSchemaSQL);
    });
}

export createDB;
