/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

module.exports = new Command({
    name: "keebs",
    description: "Lists all keyboards based on {status}.",

    async run(message, args, client) {
        let status = args;
        let check = false;
        var embed;

        status.shift(); //remove ${command}
        switch (status[0]) { //check that {status} is valid
            case "live":
                check = true;
                break;
            case "upcoming":
                check = true;
                break;
            case "ic":
                check = true;
                break;
            default:
                break;
        };

        if (args.length < 0 || !check) {
            message.reply("Invalid: must be `$keebs {status}`\nStatus must be one of the following: `live`, `upcoming`, or `ic`");
        } else {
            axios.get(`http://mechgroupbuyswrapper.herokuapp.com/keyboards?status=${status[0]}`)
                .then(res => {
                    let len = Object.keys(res.data).length;
                    let names = [];
                    let ven = []; //vendor
                    let price = [];

                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            names.push(res.data[i].name);
                            ven.push(res.data[i].vendors);
                            if (res.data[i].pricing != "") {
                                price.push(`__**$${res.data[i].pricing.substring(6, res.data[i].pricing.length)} USD**__`);
                            } else {
                                price.push("__*Price TBD*__");
                            }
                        }
                        embed = listEmbed("keyboards", names, ven, price, status[0]);
                        if (embed.length < 6000) { //max length of embed = 6000, if the length is more than that, send error message instead of embedding to prevent termination
                            message.reply({ embeds: [embed] })
                        } else {
                            message.reply(":warning: List is too long to embed, please check the main webpage: :warning:\nhttp://www.mechgroupbuys.com/keyboards")
                        }
                    } else {
                        message.reply(":exclamation: **No keyboards found in the database.** :exclamation:" +
                            "\n\nCheck main webpage here: http://www.mechgroupbuys.com/keyboards");
                    }
                })
                .catch(err => {
                    message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                        "Check main webpage here: http://www.mechgroupbuys.com/keyboards");
                    console.error("$keebs cmd ERROR"); //print error to console
                });
        }
    }
})