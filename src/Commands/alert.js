const Command = require("../Structures/Command.js");
const Database = require('better-sqlite3');
const { default: axios } = require("axios");

const invalid = "Invalid paramaters. Correct usage: `$alert {type} {name}`.\nValid types: `keyboard`, `keycaps`, `switch`";
const createTable = "CREATE TABLE IF NOT EXISTS alert('userID' TEXT, 'type' TEXT, 'name' TEXT, 'date' TEXT)";
//date not stored as SQL DATE because of how it's stored in API JSON and how getting dates work in JS

module.exports = new Command({
    name: "alert",
    description: "Sets an alert for the specificed keyboard product. Must be of status `upcoming`.",

    async run(message, args, client) {
        //create the database if not exists
        const alert = './database.sqlite3';
        let db = new Database(alert, Database.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            verbose: console.log
        })
        db.exec(createTable);

        let str = args;
        str.shift();
        if (args.length > 1) {  //only run main code if there are at least 2 parameters

            let type = str[0].toLowerCase(); //make sure parameters are not case sensitive
            let prodName = str.slice(1, str.length).join(" "); //product name

            let check = false; //check for correct parameters
            switch (type) {
                case ("keyboard"):
                    type = "keyboards";
                    check = true;
                    break;
                case ("switch"):
                    type = "switches";
                    check = true;
                    break;
                case ("keycaps"):
                    check = true;
                    break;
                default:
                    break;
            }
            if (check) {
                axios.get(`http://mechgroupbuyswrapper.herokuapp.com/${type}?status=upcoming`)
                    .then(res => {
                        let date = "";
                        let id = "";

                        //find product in JSON
                        for (let i = 0; i < Object.keys(res.data).length; i++) {
                            if (prodName.toLowerCase() === res.data[i].name.toLowerCase()) {
                                id = message.member.id; //get parameters to input into database
                                prodName = res.data[i].name;
                                date = res.data[i].startDate;

                                let del = false;
                                const stmt = db.prepare('SELECT * FROM alert'); //delete row if exists in database
                                for (const ch of stmt.iterate()) {
                                    if (ch.userID === `${id}` && ch.type === `${type}` && ch.name === `${prodName}` && ch.date === `${date}`) {
                                        del = true;
                                        break;
                                    }
                                } //boolean with if statement because db.exec doesn't work inside of the for loop above
                                if (del) {
                                    db.exec(`DELETE FROM alert WHERE userID='${id}' AND name='${prodName}'`);
                                    message.reply(`Alert has been disabled for **${prodName}** :no_entry_sign:`);
                                    return;
                                }

                                //insert alert to database
                                db.exec(`INSERT INTO alert(userID, type, name, date) VALUES('${id}', '${type}', '${prodName}', '${date}')`);
                                message.reply(`Alert has been set for **${prodName}** on **${date}** :ballot_box_with_check: `)
                                return; //return to avoid sending error message
                            }
                        }
                        //if the item wasn't found in the database, send error message and return
                        message.reply(":warning: Item not found in database. :warning:");
                        return;
                    })
                    .catch(err => {
                        console.error("$alert cmd ERROR");
                    });
            } else {
                message.reply(invalid);
            }
        } else {
            message.reply(invalid);
        }
    }
});