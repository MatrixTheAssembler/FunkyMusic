const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "clean",
    help: `${directory}/clean`,
    description: "Cleans the channel from old bot messages and old commands.",
    aliases: ["purge", "clear", "c"],
    execute(client, message, args) {
        message.channel.messages.fetch({ limit: 50 })
            .then(resp => {
                let messages = resp;
                messages = messages.filter(m => m.author.username === client.botName || m.content.startsWith(client.prefix));
                message.channel.bulkDelete(messages, true);

                console.log(`Cleaned ${messages.size} messages.`);
            })
            .catch(err => console.log("Error at clean:\n" + err));
    }
}