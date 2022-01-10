/** @format */

const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
    name: "help",
    description: "Lists commands and their descriptions.",

    async run(message, args, client) {

        let name = []; //get names and descriptions of all commands
        let desc = [];
        client.commands.forEach(command => name.push(command.name));
        client.commands.forEach(command => desc.push(command.description));

        const embed = new Discord.MessageEmbed() //create embedding
            .setTitle("Mech Alert Commands")
            .setDescription("\u200b")
            .setColor("GREEN")
            .setTimestamp();

        for (let i = 0; i < name.length; i++) { //add each command name and description to embed
            embed.addFields({
                name: `\`$${name[i]}\``,
                value: `${desc[i]}`,
                inline: false,
            });
        }
        message.reply({ embeds: [embed] });
    }
});