/** @format */

const Command = require("../Structures/Command.js");
const { default: axios } = require("axios");

module.exports = new Command({
    name: "livekeebs",
    description: "Lists all current live keyboards.",

    async run(message, args, client) {
        var str = "";

        //API link for live keyboards
        //...com/${type}?status=${status}
        axios.get("http://mechgroupbuyswrapper.herokuapp.com/keyboards?status=live")
            .then(res => {
                var ven = "";
                for (let i = 0; i < Object.keys(res.data).length; i++) {
                    //replace commas with line breaks
                    ven = res.data[i].vendors;
                    ven = ven.replaceAll(", ", "\n");

                    //string interpolate data to display name of keyboard + vendor links
                    str += `**${res.data[i].name}**:\n${ven}\n\n`;
                }
                /** message.author.send(str); **/
                message.reply(str);
            })
            .catch(err => {
                message.reply(":exclamation:**No keyboards found, or there was an error connecting to the API.**:exclamation:\n\n" +
                    "Check main webpage here: https://www.mechgroupbuys.com/switches");
                console.error("ERROR");
            });
    }
})