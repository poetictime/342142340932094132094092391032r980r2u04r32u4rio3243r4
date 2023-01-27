const Discord = require("discord.js");
const db = require('quick.db');

module.exports.run = async (client, message, args) => {
    if (client.config.bot.owner.includes(message.author.id)) {
        if (!args[0]) return message.channel.send("Please use `$disable true` or `$disable false`");
        if (args[0] === "true") {
            await db.set(`status_${client.id}`, true);
            message.channel.send("I disabled the build command!");
        } else if (args[0] === "false") {
            await db.set(`status_${client.id}`, false);
            await message.channel.send("I enabled the build command!");
        };
    }
}
module.exports.help = {
    name: "disable"
}