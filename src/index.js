const Client = require("./Structures/Client.js");
const Command = require("./Structures/Command.js")

const config = require("./Data/config.json");
const client = new Client();

console.clear();
client.start(config.token);