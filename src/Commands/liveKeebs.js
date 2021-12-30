/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");

module.exports = new Command({
    name: "liveKeebs",
    description: "Lists all current live keyboards.",

    async run(message, args, client) {
        var str = "";

        //API link for live keyboards
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keyboards?status=live")
            .then(res => {
                var ven = "";
                var len = Object.keys(res.data).length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        //replace commas with line breaks
                        ven = res.data[i].vendors;
                        ven = ven.replaceAll(", ", "\n");

                        //string interpolated data to display name of keyboard + vendor links
                        str += `**${res.data[i].name}**:\n${ven}\n\n`;
                    }
                } else {
                    str = ":exclamation: **No keyboards found in the database.** :exclamation:" +
                        "\n\nCheck main webpage here: https://www.mechgroupbuys.com/keyboards";
                }
                /** message.author.send(str); **/
                message.reply(str);
            })
            .catch(err => {
                message.reply(":warning: **There was an error connecting to the API.** :warning:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/keyboards");
                console.error("liveKeebs cmd ERROR"); //print error to console
            });
    }
})