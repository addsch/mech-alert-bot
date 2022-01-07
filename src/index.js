const Client = require("./Structures/Client.js");
const Command = require("./Structures/Command.js");
const config = require("./Data/config.json");
const cron = require("cron");
const Database = require("better-sqlite3");
const Discord = require("discord.js");

const client = new Client();

console.clear();
client.start(config.token);

let sendMessage = new cron.CronJob("0 8 * * *", () => {
    //run every day at 8:00 AM LOCAL
    const alert = './database.sqlite3';
    let db = new Database(alert, Database.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        verbose: console.log
    })
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; //add 1 since months start at 0
    const year = date.getFullYear() - 2000; //subtract 2000 since API gives last 2 digits of year

    const data = db.prepare('SELECT * FROM alert');
    let id = []; //get user's ID and product name to delete from database
    let prodName = [];
    let count = 0;
    for (const ch of data.iterate()) {
        if (ch.date === `${month}/${day}/${year}`) {
            //if (ch.date === `1/31/22`) { //for testing
            let live = new Discord.MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`**${ch.name}** is now live!`)
                .setDescription(`[MechGroupBuys Link](https://www.mechgroupbuys.com/${ch.type}/${encodeURIComponent(ch.name.trim())})`)
                .setThumbnail('https://www.mechgroupbuys.com/ab775f61ebe39404b73cd8b998a21624.png')
                .setImage(`${ch.pic}`)
                .setTimestamp();

            client.users.fetch(ch.userID).then(user => {
                user.send({ embeds: [live] });
            })
            id.push(ch.userID);
            prodName.push(ch.name);
            count++;
        }
    }
    for (let i = 0; i < count; i++) {
        db.exec(`DELETE FROM alert WHERE userID='${id[i]}' AND name='${prodName[i]}'`);
    }
    console.log(`Cron job executed. ${count} DMs sent.`);
});
sendMessage.start();