const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Löscht alle Bot-Nachrichten."),
        
    async execute(interaction) {
        interaction.deferReply();
        interaction.deleteReply();

        interaction.channel.messages.fetch({ limit: 50 })
            .then(resp => {
                let messages = resp;
                messages = messages.filter(message => message.author.username === interaction.client.user.username || message.content.startsWith(interaction.client.prefix));
                interaction.channel.bulkDelete(messages, true);

                console.log(`Cleaned ${messages.size} messages.`);
            })
            .catch(err => console.log("Error at clean:\n" + err));
    }
}