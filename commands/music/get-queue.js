const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-queue")
        .setDescription("Zeigt die Warteschlange an."),

    async execute(interaction) {
        const { voice } = interaction.member;
        const guildAudioQueue = interaction.client.player.getQueue(interaction.guild.id);

        if (!voice.channel) {
            interaction.reply("Du musst in einem Sprachkanal sein.", { ephemeral: true });
            console.log("Not in voice channel.");
            return;
        }

        if (!guildAudioQueue || !guildAudioQueue.songs.length || guildAudioQueue.songs.length <= 1) {
            interaction.reply("Kein Song in der Warteschlange.");
            console.log("No song in Queue.");
            return;
        }

        let newMessage = "";
        for(let i = 1; i < guildAudioQueue.songs.length; i++){
            newMessage += i + ": " + guildAudioQueue.songs[i] + "\n";

            if(newMessage.length > 1500){
                interaction.reply(newMessage);
                newMessage = "";
            }
        }

        if(newMessage.length > 0){
            interaction.reply(newMessage);
        }

        console.log("Get Queue " + guildAudioQueue.songs.length);
    }
}