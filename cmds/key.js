const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (client, message, args) => {
  if (client.config.bot.owner.includes(message.author.id)) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.channel.send("Specify a user");
    let key = `LLX404-${random(4)}-${random(4)}`;
    const embed1 = new Discord.MessageEmbed()
    embed1.setDescription(`${user} __Look DM:__`);
    embed1.setColor("2f3136");
    embed1.setFooter("@loverstealer");
    embed1.setTimestamp();
    await message.channel.send(embed1);
    await user.send(`Hey, thanks for using ${client.config.name}!\nYour key: \`${key}\``).catch(() => { });
    await db.push(`keys_${client.id}`, { id: user.id, cle: key });
    const embed2 = new Discord.MessageEmbed()
    embed2.setTitle("New Key");
    embed2.setColor('2f3136');
    embed2.addFields({ name: "Author:", value: `*<@${message.author.id}> (${message.author.id})*`, inline: true }, { name: "Member:", value: `*<@${user.id}> (${user.id})*`, inline: true }, { name: "Key:", value: `*${key}*`, inline: true });
    embed2.setTimestamp();
    embed2.setFooter('@loverstealer');
    const log = client.channels.cache.get(client.config.logs);
    if (log) log.send(embed2);
  }
}

function random(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports.help = {
  name: "key"
}