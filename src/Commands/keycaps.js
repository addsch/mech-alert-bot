/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const list = require("../Functions/list.js");

module.exports = new Command({
    name: "keycaps",
    description: "Lists all keycaps in database based on {status}.",

    async run(message, args, client) {
        list(message, args);
    }
})