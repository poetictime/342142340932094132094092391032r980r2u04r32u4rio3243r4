const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (client, message, args) => {
    if (client.config.bot.owner.includes(message.author.id)) {
        const key = args[0];
        if (!key) return message.channel.send("Specify a key");
        const keydb = Object.values(db.get(`keys_${client.id}`)).find(element => element.cle === key);
        if (!keydb) return message.channel.send('Key doesn\'t exist');
        const data = Object.values(db.get(`keys_${client.id}`));
        const newArray = [];
        for (let d of data) {
            if (d.cle == key) continue;
            else newArray.push(d)
        };
        await db.set(`keys_${client.id}`, newArray);
        return message.channel.send('Key deleted');
    }
}

module.exports.help = {
    name: "deletekey"
}