const Discord = require("discord.js")

//name, ven, price
const listEmbed = (type, names, ven, price, status) => {
    let description = "\u200b";
    let len = names.length - 1;

    //change URL based on command
    let nameURL = [];
    for (let i = 0; i <= len; i++) {
        let temp = names[i]; //get name of keyboard for hyperlink
        temp = encodeURIComponent(temp.trim()); //trim whitespace and URL encode
        nameURL.push(`https://www.mechgroupbuys.com/${type.toLowerCase()}/${temp}`);
    }

    let gt = false;
    let count = 0;
    for (let x = 0; x < ven.length; x++) {
        count += ven[x].length;
    }
    if (count > 3999) {//if vendor list is 3999 or greater chars, shorten list to just the main vendors
        gt = true;
        description = "__***Note: Due to character limits, only the main vendor is listed.***__" + description;
    }
    for (let z = 0; z < ven.length; z++) {
        if (gt) {
            if (ven[z].includes(",")) {
                ven[z] = ven[z].substring(0, ven[z].indexOf(","));
            }
        } else { //else, keep all vendors
            if (ven[z].includes(",")) {
                ven[z] = ven[z].replaceAll(", ", "\n");
            }
        }
    }

    let embedRes = new Discord.MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`MechGroupBuys: ${status} ` + type)
        .setURL(`https://www.mechgroupbuys.com/${type.toLowerCase()}`)
        .setDescription(description) //whitespace between title and fields
        .setThumbnail("https://www.mechgroupbuys.com/ab775f61ebe39404b73cd8b998a21624.png")
        .setTimestamp();

    //dynamically add keyboard names, prices, and vendor list
    for (let j = 0; j <= len; j++) {
        embedRes.addFields({
            name: "\u200b",
            value: `**[${names[j]}](${nameURL[j]})**\n${price[j]}\n${ven[j]}`,
            inline: true,
        })
    }

    return embedRes;

}

module.exports = listEmbed;