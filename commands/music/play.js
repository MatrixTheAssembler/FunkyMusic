const { SlashCommandBuilder } = require("discord.js");
const { Utils } = require("discord-music-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Spielt Musik von YouTube und Spotify oder setzt die Wiedergabe fort.")
        .addStringOption(option => option.setName("song").setDescription("Der Song, der abgespielt werden soll.")),

    async execute(interaction) {
        const { voice } = interaction.member;
        const guildAudioQueue = interaction.client.player.getQueue(interaction.guild.id);

        const song = interaction.options.getString("song");

        if (!voice.channel) {
            interaction.reply("Du musst in einem Sprachkanal sein.", { ephemeral: true });
            console.log("Not in voice channel.");
            return;
        }

        if (!song) {
            if (!guildAudioQueue || !guildAudioQueue.songs.length) {
                interaction.reply("Kein Song in der Warteschlange.");
                console.log("No song in Queue.");
                return;
            }

            guildAudioQueue.setPaused(false);
            interaction.reply("Wiedergabe fortgesetzt.");
            console.log("Resume");
            return;
        }

        interaction.deferReply();

        let searchTerm = song;
        searchTerm = searchTerm.replace("music.youtube.com", "youtube.com");

        if (searchTerm.includes("spotify")) {
            searchTerm = searchTerm.replace("open.", "");
        }

        console.log("Play " + searchTerm);

        const queue = interaction.client.player.createQueue(interaction.guild.id);
        queue.setData({ initMessage: interaction });

        Utils.best(searchTerm, { timecode: true }, queue).then(song => {
            if (interaction.client.isSongInForbiddenSongs(song)) {
                console.log("Song is in forbidden songs.");
                interaction.editReply("Dieser Song ist nicht erlaubt.");
                return;
            }

            queue.join(voice.channel).then(() => {
                queue.play(song.url, { timecode: true });
                interaction.editReply("Song hinzugefügt.");
                console.log("Song added.");
            }).catch(err => {
                if (!guildAudioQueue)
                    queue.stop();
                interaction.editReply("Fehler beim Abspielen.");
                console.log("Error at play 2:\n" + err);
            });
        }).catch(err => {
            interaction.editReply("Fehler beim Abspielen.");
            console.log("Error at play 1:\n" + err);
        });
    }
}