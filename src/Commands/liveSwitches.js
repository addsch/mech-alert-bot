/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");

module.exports = new Command({
    name: "liveSwitches",
    description: "Lists all switches currently live for sale.",

    async run(message, args, client) {
        var str = "";

        //API link for live keycaps
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/switches?status=live")
            .then(res => {
                var ven = ""; //vendors
                var price = ""; //price of switches
                var len = Object.keys(res.data).length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        //replace commas with line breaks
                        ven = res.data[i].vendors;
                        if (ven.includes(",")) {
                            ven = ven.substring(0, ven.indexOf(","));
                        }

                        //string interpolated data to display name of switches + vendor links
                        str += `**${res.data[i].name}**:\n${ven} \n\n`;
                    }
                    str = "__***Note: Due to character limits, only the main vendor is listed.***__\n\n" + str
                } else {
                    str = ":exclamation: **No switches found in the database.** :exclamation:" +
                        "\n\nCheck main webpage here: https://www.mechgroupbuys.com/switches";
                }
                /** message.author.send(str); **/
                message.reply(str);
            })
            .catch(err => {
                message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                    "Check the main webpage here: https://www.mechgroupbuys.com/switches");
                console.error("liveSwitches cmd ERROR"); //print error to console
            });
    }
})