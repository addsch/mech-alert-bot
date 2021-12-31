/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

module.exports = new Command({
    name: "liveKeebs",
    description: "Lists all current live keyboards.",

    async run(message, args, client) {
        let str = "";
        var embed;

        //API link for live keyboards
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keyboards?status=live")
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

                        //ven[i] = res.data[i].vendors;
                        //replace commas with line breaks
                        if (ven[i].includes(",")) {
                            ven[i] = ven[i].replaceAll(", ", "\n");
                        }
                    }
                    embed = listEmbed("Keyboards", names, ven, price);
                    message.reply({ embeds: [embed] });
                } else {
                    str = ":exclamation: **No keyboards found in the database.** :exclamation:" +
                        "\n\nCheck main webpage here: https://www.mechgroupbuys.com/keyboards";
                    message.reply(str);
                }
            })
            .catch(err => {
                message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/keyboards");
                console.error("liveKeebs cmd ERROR"); //print error to console
            });
    }
})