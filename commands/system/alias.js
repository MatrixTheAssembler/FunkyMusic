const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "alias",
    help: `${directory}/alias <command>`,
    description: "alias page",
    execute(client, message, args){
        if(!args.length){
            message.channel.send("Alias of what?");
            console.log("Alias of what?");
            return;
        }

        const commandName = args[0];

        const command = client.commands.get(commandName) || client.aliases.get(commandName);
        if(!command){
            message.channel.send(`Command ${commandName} could not be found.`)
            console.log(`Command ${commandName} could not be found.`);
            return;
        }

        const aliases = [...new Set([...[command.name], ...command.aliases])].sort();
        
        if(!aliases){
            message.channel.send(`No aliases for ${commandName} found`);
            console.log(`No aliases for ${commandName} found`);
            return;
        }

        let newMessage = `aliases of ${commandName}: `;
        aliases.sort().forEach(alias => {
            newMessage += `${alias}, `;
        });
        newMessage = newMessage.slice(0, -2);

        message.channel.send(newMessage);
        console.log(`alias ${args[0]}`);
    }
}