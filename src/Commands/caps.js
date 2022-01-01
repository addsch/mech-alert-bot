/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

module.exports = new Command({
    name: "caps",
    description: "Lists all keycaps based on {status}.",

    async run(message, args, client) {
        let status = args;
        let check = false;
        let ic = false;
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
            message.reply("Invalid: must be `$caps {status}`\nStatus must be one of the following: `live`, or `upcoming` (IC list is too long to embed)");
        } else {
            axios.get(`http://mechgroupbuyswrapper.herokuapp.com/keycaps?status=${status[0]}`)
                .then(res => {
                    let len = Object.keys(res.data).length;
                    let names = [];
                    let ven = []; //vendor
                    let price = [];

                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            names.push(res.data[i].name);
                            if (!ic) {
                                ven.push(res.data[i].vendors);
                            }
                            if (res.data[i].pricing != "") {
                                price.push(`__**$${res.data[i].pricing.substring(6, res.data[i].pricing.length)} USD**__`);
                            } else {
                                price.push("__*Price TBD*__");
                            }

                            //replace commas with line breaks

                        }
                        embed = listEmbed("keycaps", names, ven, price, status[0]);
                        if (embed.length < 6000) {
                            message.reply({ embeds: [embed] })
                        } else {
                            message.reply(":warning: List is too long to embed, please check the main webpage: :warning:\nhttps://www.mechgroupbuys.com/keycaps")
                        }
                    } else {
                        message.reply(":exclamation: **No keycaps found in the database.** :exclamation:" +
                            "\n\nCheck main webpage here: https://www.mechgroupbuys.com/keycaps");
                    }
                })
                .catch(err => {
                    message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                        "Check main webpage here: https://www.mechgroupbuys.com/keycaps");
                    console.error("$caps cmd ERROR"); //print error to console
                });
        }
    }
})