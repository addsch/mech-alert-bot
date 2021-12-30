/** @format */

const Command = require("../Structures/Command.js");

module.exports = new Command({
    name: "echo",
    description: "Repeats the message back to user.",

    async run(message, args, client) {

        let str = args;
        str.shift();
        if (args.length > 0) {
            //if $echo is called with inputs, return parsed input
            str = args;
            str.join(" ");
        } else {
            str = "*You notice a small gust of wind.*";
        }

        const msg = await message.reply(`${str}`);

    }
});