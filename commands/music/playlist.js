const { Utils } = require("discord-music-player");

const directory = __dirname.slice(__dirname.lastIndexOf('/') + 1);

module.exports = {
    name: "playlist",
    help: `${directory}/playlist <URL | search term>`,
    description: "Adds audio from YouTube, Spotify and co to playlist.",
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
            message.channel.send("Play what?");
            console.log("Play what?");
            return;
        }

        var searchTerm = args.join(" ");
        searchTerm = searchTerm.replace("music.youtube.com", "youtube.com");
        searchTerm = searchTerm.replace("&feature=share", "");

        console.log("Playlist " + searchTerm);

        const queue = client.player.createQueue(message.guild.id);
        queue.setData({ initMessage: message });
        queue.join(voice.channel).then(() => {
            Utils.playlist(searchTerm, {}, queue).then(playlist => {
                playlist.songs = playlist.songs.filter(song => !client.isSongInForbiddenSongs(song));
                queue.playlist(playlist);

            }).catch(err => console.log("Error at playlist 1:\n" + err));
        }).catch(err => {
            if (!guildAudioQueue)
                queue.stop();
            console.log("Error at playlist 2:\n" + err);
        });
    }
}