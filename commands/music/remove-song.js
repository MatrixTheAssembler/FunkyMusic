const { Utils } = require("discord-music-player");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-song")
        .setDescription("Entfernt einen Song aus der Warteschlange.")
        .addIntegerOption(option => option.setName("song-id").setDescription("Die ID des Songs.").setRequired(true)),

    async execute(interaction) {
        const { voice } = interaction.member;
        const guildAudioQueue = interaction.client.player.getQueue(interaction.guild.id);

        if (!voice.channel) {
            interaction.reply("Du musst in einem Sprachkanal sein.", { ephemeral: true });
            console.log("Not in voice channel.");
            return;
        }

        if (!guildAudioQueue || !guildAudioQueue.songs.length) {
            interaction.reply("Kein Song in der Warteschlange.");
            console.log("No song in Queue.");
            return;
        }

        const songId = interaction.options.getInteger("song-id");
        if (songId < 1 || songId > guildAudioQueue.songs.length - 1) {
            interaction.reply("ID nicht verfügbar.");
            console.log("Remove song, strange index");
            return;
        }

        const song = guildAudioQueue.songs[songId];
        guildAudioQueue.remove(songId);
        
        console.log(`Removed ${song}`);
        interaction.reply(`Removed ${song}`);
    }
}