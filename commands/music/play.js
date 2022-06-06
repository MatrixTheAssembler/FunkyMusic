const { Utils } = require("discord-music-player");

const directory = __dirname.slice(__dirname.lastIndexOf('/') + 1);

module.exports = {
    name: "play",
    help: `${directory}/play [URL | search term]`,
    description: "Plays audio from YouTube, Spotify and co and resumes audio, if paused and no argument is given.",
    aliases: ["p", "resume"],
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
            console.log("Not in voice channel.");
            return;
        }

        if (!args.length) {
            if (!guildAudioQueue || !guildAudioQueue.songs.length) {
                message.channel.send("No song in Queue.");
                console.log("No song in Queue.");
                return;
            }

            guildAudioQueue.setPaused(false);
            console.log("Resume");
            message.channel.send("Resumed Queue");
            return;
        }

        var searchTerm = args.join(" ");
        searchTerm = searchTerm.replace("music.youtube.com", "youtube.com");

        console.log("Play " + searchTerm);

        const queue = client.player.createQueue(message.guild.id);
        queue.setData({ initMessage: message });
        queue.join(voice.channel).then(() => {
            Utils.best(searchTerm, { timecode: true }, queue).then(song => {
                if (client.isSongInForbiddenSongs(song)) {
                    console.log("Song is in forbidden songs.");
                    message.channel.send("This song is not allowed.");
                    return;
                }

                queue.play(song.url, { timecode: true });

            }).catch(err => console.log(`Error at play 1: ${err}`));
        }).catch(err => {
            if (!guildAudioQueue)
                queue.stop();
            console.log("Error at play 2:\n" + err);
        });
    }
}