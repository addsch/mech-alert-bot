const Command = require("../Structures/Command.js");
const Database = require('better-sqlite3');

const createTable = "CREATE TABLE IF NOT EXISTS test('a' TEXT)";

module.exports = new Command({
    name: "test",
    description: "dw.",

    async run(message, args, client) {

        let str = args;
        const test = './databaseUsers.sqlite3';
        let db = new Database(test, Database.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            verbose: console.log
        }
        );
        db.exec(createTable);

        db.exec("INSERT INTO test (a) VALUES ('woah')");

        const stmt = db.prepare('SELECT * FROM test');

        for (const a of stmt.iterate()) {
            if (a.a === 'woah') {
                console.log('right here');
            }
        }



    }
});