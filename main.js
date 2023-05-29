require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Player } = require("discord-music-player");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//////////////////////////////////////////////////////////////////////////////////
client.commands = new Collection();
client.player = new Player(client, { timeout: 10 * 60 * 1000, leaveOnEmpty: true });
client.forbiddenSongs = [];
//////////////////////////////////////////////////////////////////////////////////

const commandFiles = getAllFiles("./commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(file => {
    const command = require(file);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.error(`Command ${file} is missing data or execute`);
    }
});


const forbiddenSongs = JSON.parse(fs.readFileSync("./forbidden-songs.json", "utf8")).forbiddenSongs;
client.forbiddenSongs = forbiddenSongs;


setPlayerListeners(client);


client.on(Events.InteractionCreate, async interaction => {
    let component = null;

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Command ${interaction.commandName} is not registered`);
            return;
        }

        component = command;
    }

    if (component) {
        try {
            component.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp("Beim Ausführen ist ein Fehler aufgetreten!");
            } else {
                interaction.reply("Beim Ausführen ist ein Fehler aufgetreten!");
            }
        }
    }
});


client.once(Events.ClientReady, () => {
    console.log("Funky Penguin Bot is ready!");
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
            const message = `Added to queue: ${song}`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when a playlist was added to the queue.
        .on('playlistAdd', (queue, playlist) => {
            const message = `Playlist of length ${playlist.songs.length} was added to queue: ${playlist}`;
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
            const message = `Started playing: ${newSong}`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when a first song in the queue started playing.
        .on('songFirst', (queue, song) => {
            const message = `Started playing: ${song}`;
            queue.data.initMessage.channel.send(message);
            console.log(message);
        })
        // Emitted when someone disconnected the bot from the channel.
        .on('clientDisconnect', (queue) =>
            console.log(`I was kicked from the Voice Channel, queue ended.`))
        // Emitted when deafenOnJoin is true and the bot was undeafened
        .on('clientUndeafen', (queue) =>
            console.log(`I got undefeanded.`))
        // Emitted when there was an error at runtime
        .on('error', (error, queue) => {
            console.log(`Error: ${error} in ${queue.guild.name}`);
        });
}


client.isSongInForbiddenSongs = function isSongInForbiddenSongs(song) {
    for (let i = 0; i < client.forbiddenSongs.length; i++) {
        if (song.name.toLowerCase().includes(client.forbiddenSongs[i].toLowerCase())) {
            return true;
        }
    }
    return false;
}