module.exports = {
    name: "playlist",
    help: "music/playlist <URL|search term>",
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

        const queue = client.player.createQueue(message.guild.id);
        queue.setData({initMessage: message});
        queue.join(voice.channel).then(() => queue.play(args.join(" ")))
            .catch(err => {
                if (!guildAudioQueue)
                    queue.stop();
                console.log("Error at playlist:\n" + err);
            });

        console.log("Playlist " + args.join(" "));
    }
}