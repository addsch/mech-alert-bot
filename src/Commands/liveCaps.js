/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");

module.exports = new Command({
    name: "livecaps",
    description: "Lists all current live keycaps.",

    async run(message, args, client) {
        var str = "";

        //API link for live keycaps
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keycaps?status=live")
            .then(res => {
                var ven = "";
                for (let i = 0; i < Object.keys(res.data).length; i++) {
                    //replace commas with line breaks
                    ven = res.data[i].vendors;
                    if (ven.includes(",")) {
                        ven = ven.substring(0, ven.indexOf(","));
                    }

                    //string interpolate data to display name of keycaps + vendor links
                    str += `**${res.data[i].name}**:\n${ven}\n\n`;
                }
                /** message.author.send(str); **/
                message.reply("__***Note: Due to character limits, only the main vendor is listed.***__\n\n"
                    + str);
            })
            .catch(err => {
                message.reply(":exclamation:**No keycaps found, or there was an error connecting to the API.**:exclamation:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/switches");
                console.error("ERROR");
            });
    }
})