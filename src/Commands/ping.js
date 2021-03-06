/** @format */

const Command = require("../Structures/Command.js");

module.exports = new Command({
    name: "ping",
    description: "Pong!",

    async run(message, args, client) {

        const msg = await message.reply(`Latency: ${client.ws.ping} ms.`);

        msg.edit(`Latency: ${client.ws.ping} ms.\nBot API Latency: ${msg.createdTimestamp - message.createdTimestamp} ms.`)

    }
});