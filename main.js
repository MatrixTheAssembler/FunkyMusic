require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Collection, Intents, Client } = require("discord.js");
const { Player } = require("discord-music-player");


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.botName = "Funky Music";
client.prefix = "+";

const channelTypeText = "GUILD_TEXT";


client.commands = new Collection();
client.aliases = new Collection();
const commmandFiles = getAllFiles("./commands").filter(file => file.endsWith(".js"));

commmandFiles.forEach(file => {
    const command = require(file);

    client.commands.set(command.name, command);

    if (command.aliases) {
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command)
        })
    }
});

// other variables
client.player = new Player(client, {timeout: 10 * 60 * 1000});
setPlayerListeners(client);


client.once("ready", () => {
    console.log("Funky Music Bot is online!");
});


client.on("messageCreate", message => {
    if (!message.content.startsWith(client.prefix) || message.author.bot || !message.guild) return;

    const args = message.content.slice(client.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.aliases.get(commandName);

    if (!command) {
        message.channel.send(`Type ${client.prefix}help or ${client.prefix}? to get help.`);
        console.log(`Command ${commandName} could not be found.`);
        return;
    }

    command.execute(client, message, args);
});

client.login(process.env.BOT_TOKEN);




function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
        }
    });

    return arrayOfFiles
}


function setPlayerListeners(client) {
    client.player
        // Emitted when channel was empty.
        .on('channelEmpty', (queue) => {
            const message = `Everyone left the Voice Channel, queue ended.`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when a song was added to the queue.
        .on('songAdd', (queue, song) => {
            const message = `${song} was added to the queue.`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when a playlist was added to the queue.
        .on('playlistAdd', (queue, playlist) => {
            const message = `Playlist ${playlist} with ${playlist.songs.length} songs was added to the queue.`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when there was no more music to play.
        .on('queueDestroyed', (queue) =>
            console.log(`The queue was destroyed.`))
        // Emitted when the queue was destroyed (either by ending or stopping).    
        .on('queueEnd', (queue) =>
            console.log(`The queue has ended.`))
        // Emitted when a song changed.
        .on('songChanged', (queue, newSong, oldSong) => {
            const message = `${newSong} is now playing.`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when a first song in the queue started playing.
        .on('songFirst', (queue, song) => {
            const message = `Started playing ${song}.`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when someone disconnected the bot from the channel.
        .on('clientDisconnect', (queue) =>
            console.log(`I was kicked from the Voice Channel, queue ended.`))
        // Emitted when deafenOnJoin is true and the bot was undeafened
        .on('clientUndeafen', (queue) =>
            console.log(`I got undefeanded.`))
        // Emitted when there was an error in runtime
        .on('error', (error, queue) => {
            console.log(`Error: ${error} in ${queue.guild.name}`);
        });
}


function firstTextChannel(guild) {
    return guild.channels.cache.find(channel => channel.type === channelTypeText);
}