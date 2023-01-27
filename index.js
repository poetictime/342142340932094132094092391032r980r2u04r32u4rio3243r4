const { Client, Collection } = require("discord.js");
const client = new Client({
    restTimeOffset: 0,
    ws: {
        properties: {
            $browser: "Discord iOS"
        }
    }
});
const fs = require("fs")
const config = require("./config.json");
require('./server');
process.on("unhandledRejassetsion", (a) => { if (a.message) return; });

client.commands = new Collection();
client.config = config;

fs.readdir('./cmds/', (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
        console.log('[HANDLER]: Je detecte aucune commande !')
    };
    jsfile.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        // console.log(`[HANDLER]: ${f} Prêt !`)
        client.commands.set(props.help.name, props);
    })
})

client.on("ready", async () => {
    console.log(`BOT ON (${client.user.tag})`)
});

client.on("message", async message => {
    let prefix = client.config.bot.prefix;
    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = client.commands.get(command.slice(prefix.length));
    if (commandFile) commandFile.run(client, message, args)
});

client.login(process.env.TOKEN);
