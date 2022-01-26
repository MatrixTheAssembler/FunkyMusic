module.exports = {
    name: "nowplaying",
    help: "music/nowplaying",
    description: "Shows currently playing audio.",
    execute(client, message, args) {
        const { voice } = message.member;
        const guildAudioQueue = client.player.getQueue(message.guild.id);

        if (!voice.channel) {
            message.channel.send("You must be in a voice channel.");
            console.log("You must be in a voice channel.");
            return;
        }

        if(!guildAudioQueue){
            message.channel.send("No song in Queue.");
            console.log("No song in Queue.");
            return;
        }

        message.channel.send(`Now playing: ${guildAudioQueue.nowPlaying}`);

        console.log("Now Playing");
    }
}