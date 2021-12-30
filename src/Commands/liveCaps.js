/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");

module.exports = new Command({
    name: "liveCaps",
    description: "Lists all keycaps currently live for sale.",

    async run(message, args, client) {
        var str = "";

        //API link for live keycaps
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keycaps?status=live")
            .then(res => {
                var ven = "";
                var len = Object.keys(res.data).length; //
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        //replace commas with line breaks
                        ven = res.data[i].vendors;
                        if (ven.includes(",")) {
                            ven = ven.substring(0, ven.indexOf(","));
                        }

                        //string interpolated data to display name of switches + vendor links
                        str += `**${res.data[i].name}**:\n${ven}\n\n`;
                    }
                    str = "__***Note: Due to character limits, only the main vendor is listed.***__\n\n" + str
                } else {
                    str = ":exclamation: **No keycaps found in the database.** :exclamation:" +
                        "\n\nCheck the main webpage here: https://www.mechgroupbuys.com/keycaps";
                }
                /** message.author.send(str); **/
                message.reply(str);
            })
            .catch(err => {
                message.reply(":exclamation:**There was an error connecting to the API.**:exclamation:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/keycaps");
                console.error("ERROR");
            });
    }
})