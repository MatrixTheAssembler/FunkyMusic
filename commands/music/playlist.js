const { Utils } = require("discord-music-player");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Fügt eine Playlist hinzu.")
        .addStringOption(option => option.setName("playlist").setDescription("Playlist Name").setRequired(true)),

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

        interaction.deferReply();

        let searchTerm = interaction.options.getString("playlist");
        searchTerm = searchTerm.replace("music.youtube.com", "youtube.com");
        searchTerm = searchTerm.replace("&feature=share", "");

        console.log("Playlist " + searchTerm);

        const queue = interaction.client.player.createQueue(message.guild.id);
        queue.setData({ initMessage: message });
        queue.join(voice.channel).then(() => {
            Utils.playlist(searchTerm, {}, queue).then(playlist => {
                playlist.songs = playlist.songs.filter(song => !interaction.client.isSongInForbiddenSongs(song));
                queue.playlist(playlist);
                interaction.editReply("Playlist hinzugefügt.");
                console.log("Playlist added.");
            }).catch(err => console.log("Error at playlist 1:\n" + err));
        }).catch(err => {
            if (!guildAudioQueue)
                queue.stop();
            console.log("Error at playlist 2:\n" + err);
        });
    }
}