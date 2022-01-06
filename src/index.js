const Client = require("./Structures/Client.js");
const Command = require("./Structures/Command.js");
const config = require("./Data/config.json");
const cron = require("cron");
const Database = require("better-sqlite3");
const Discord = require("discord.js");

const client = new Client();

console.clear();
client.start(config.token);

let sendMessage = new cron.CronJob("0 9 * * *", () => {
    //run every day at 9:00 AM
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
    for (const ch of data.iterate()) {
        if (ch.date === `${month}/${day}/${year}`) {
            let live = new Discord.MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`**${ch.name}** is now live!`)
                .setDescription(`[MechGroupBuys Link](http://www.mechgroupbuys.com/${ch.type}/${encodeURIComponent(ch.name.trim())})`)
                .setThumbnail('http://www.mechgroupbuys.com/ab775f61ebe39404b73cd8b998a21624.png')
                .setImage(`${ch.pic}`)
                .setTimestamp();

            client.users.fetch(ch.userID).then(user => {
                user.send({ embeds: [live] });
            })
        }
    }
});
sendMessage.start();