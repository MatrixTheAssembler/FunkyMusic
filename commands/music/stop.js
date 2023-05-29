const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stoppt die Wiedergabe."),

    async execute(interaction) {
        const { voice } = interaction.member;
        const guildAudioQueue = interaction.client.player.getQueue(interaction.guild.id);

        if (!voice.channel) {
            interaction.reply("Du musst in einem Sprachkanal sein.", { ephemeral: true });
            console.log("Not in voice channel.");
            return;
        }

        if(!guildAudioQueue || !guildAudioQueue.songs.length){
            interaction.reply("Kein Song in der Warteschlange.");
            console.log("No song in Queue.");
            return;
        }

        guildAudioQueue.clearQueue();
        guildAudioQueue.skip();
        // stop function of package has a bug, so we need to use this workaround
        // guildAudioQueue.stop();

        interaction.reply("Warteschlange gestoppt.");
        console.log("Stop");
    }
}