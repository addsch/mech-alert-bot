/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

module.exports = new Command({
    name: "liveCaps",
    description: "Lists all keycaps currently live for sale.",

    async run(message, args, client) {
        var str = "";

        //API link for live keycaps
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keycaps?status=live")
            .then(res => {
                let len = Object.keys(res.data).length;
                let names = [];
                let ven = []; //vendor
                let price = [];

                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        names.push(res.data[i].name);
                        ven.push(res.data[i].vendors);
                        price.push(res.data[i].pricing);
                    }
                    embed = listEmbed("Keycaps", names, ven, price);
                    message.reply({ embeds: [embed] });
                } else {
                    str = ":exclamation: **No keyboards found in the database.** :exclamation:" +
                        "\n\nCheck main webpage here: https://www.mechgroupbuys.com/keycaps";
                    message.reply(str);
                }
            })
            .catch(err => {
                message.reply(":exclamation:**There was an error connecting to the API.**:exclamation:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/keycaps");
                console.error("ERROR");
            });
    }
})