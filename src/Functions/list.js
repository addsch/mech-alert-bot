const { default: axios } = require("axios");
const listEmbed = require("../Functions/listEmbed.js");

const list = (message, args) => {
    let status = args;
    let check = false;

    let cmd = status.shift(); //remove ${command}
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
        message.reply(`Invalid: must be \`$${cmd} {status}\`\nStatus must be one of the following: \`live\`, \`upcoming\`, or \`ic\``);
    } else {
        axios.get(`https://mechgroupbuyswrapper.herokuapp.com/${cmd}?status=${status[0]}`)
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
                    let embed = listEmbed(`${cmd}`, names, ven, price, status[0]);
                    if (embed.length < 6000) { //max length of embed = 6000, if the length is more than that, send error message instead of embedding to prevent termination
                        message.reply({ embeds: [embed] })
                    } else {
                        message.reply(`:warning: List is too long to embed, please check the main webpage: :warning:\nhttps://www.mechgroupbuys.com/${cmd}`)
                    }
                } else {
                    message.reply(`:warning: **No ${cmd} found in the database.** :warning:\n\nCheck main webpage here: https://www.mechgroupbuys.com/${cmd}`);
                }
            })
            .catch(err => {
                message.reply(`:warning: **There was an error connecting to the API.** :warning:\n\nCheck main webpage here: https://www.mechgroupbuys.com/${cmd}`);
                console.error(`$${cmd} cmd ERROR`); //print error to console
            });
    }
}

module.exports = list;