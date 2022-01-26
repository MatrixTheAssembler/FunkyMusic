module.exports = {
    name: "help",
    description: "help page",
    aliases: ["?", "h"],
    execute(client, message, args){
        if(args.length){
            const command = client.commands.get(args[0]);
            
            if(!command){
                message.channel.send(`${args[0]} is not a command`)
                console.log(`help ${args[0]} is not a command`)
                return;
            }

            message.channel.send(command.description);
            console.log(`help ${command.name}`);
            return;
        }

        const commands = client.helps;
        const systemCommands = commands.filter(command => command.help.startsWith("system/")).map(command => command.help.split("/").slice(1));
        const musicCommands = commands.filter(command => command.help.startsWith("music/")).map(command => command.help.split("/").slice(1));

        let newMessage = "system:\n";
        systemCommands.forEach(command => {
            newMessage += `${command}, `;
        });
        newMessage = newMessage.slice(0, -2);
        newMessage += "\n";

        newMessage += "music:\n";
        musicCommands.forEach(command => {
            newMessage += `${command}, `;
        });
        newMessage = newMessage.slice(0, -2);

        message.channel.send(newMessage);
        console.log("help");
    }
}