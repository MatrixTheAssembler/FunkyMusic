const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "removesong",
    help: `${directory}/removesong <song ID>`,
    description: "Removes audio from queue.",
    aliases: ["r", "remove"],
    execute(client, message, args) {
        const { voice } = message.member;
        const guildAudioQueue = client.player.getQueue(message.guild.id);

        const guildRoles = message.guild.roles.cache;
        const memberRoles = message.member._roles;
        const guildMemberRoles = guildRoles
            .filter(role => memberRoles.includes(role.id))
            .map(role => role.name.toLowerCase());
        if (!guildMemberRoles.includes("dj")) {
            message.channel.send("You need the DJ role to manipulate music.");
            console.log("Not DJ role.");
            return;
        }

        if (!voice.channel) {
            message.channel.send("You must be in a voice channel.");
            console.log("You must be in a voice channel.");
            return;
        }

        if (!args.length) {
            message.channel.send("Remove what? -removeSong <song ID>");
            console.log("Remove what?");
            return;
        }

        if(!guildAudioQueue){
            message.channel.send("No song in Queue.");
            console.log("No song in Queue.");
            return;
        }

        const songId = parseInt(args[0]);
        if (songId < 1 || songId > guildAudioQueue.songs.length - 1) {
            message.channel.send("ID not available");
            console.log("Remove Index out of bounds");
            return;
        }

        const song = guildAudioQueue.songs[songId];
        guildAudioQueue.remove(songId);
        
        message.channel.send("Removed " + song.name + " | " + song.author)

        console.log("Remove Song");
    }
}