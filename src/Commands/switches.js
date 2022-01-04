/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

module.exports = new Command({
    name: "switches",
    description: "Lists all switches based on {status}.",

    async run(message, args, client) {
        let status = args;
        let check = false;
        var embed;

        status.shift(); //remove command
        switch (status[0]) {
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
            message.reply("Invalid: must be `$switches {status}`\nStatus must be one of the following: `live`, `upcoming`, or `ic`");
        } else {
            axios.get(`http://mechgroupbuyswrapper.herokuapp.com/switches?status=${status[0]}`)
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
                        embed = listEmbed("switches", names, ven, price, status[0]);
                        if (embed.length < 6000) {
                            message.reply({ embeds: [embed] })
                        } else {
                            message.reply(":warning: List is too long to embed, please check the main webpage: :warning:\nhttp://www.mechgroupbuys.com/switches")
                        }
                    } else {
                        message.reply(":exclamation: **No switches found in the database.** :exclamation:" +
                            "\n\nCheck main webpage here: http://www.mechgroupbuys.com/switches");
                    }
                })
                .catch(err => {
                    message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                        "Check main webpage here: http://www.mechgroupbuys.com/switches");
                    console.error("$keebs cmd ERROR"); //print error to console
                });
        }
    }
})