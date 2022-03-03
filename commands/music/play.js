const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

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
            if (!guildAudioQueue) {
                message.channel.send("No song in Queue.");
                console.log("No song in Queue.");
                return;
            }

            guildAudioQueue.setPaused(false);
            console.log("Resume");
            return;
        }

        const queue = client.player.createQueue(message.guild.id);
        queue.setData({initMessage: message});
        queue.join(voice.channel).then(() => {
            try {
                console.log("Play " + args.join(" "));
                queue.play(args.join(" "), {timecode: true});
            } catch (err) {
                console.log("Error at play:\n" + err);
            }
        }).catch(err => {
            if (!guildAudioQueue)
                queue.stop();
            console.log("Error at play:\n" + err);
        });
    }
}