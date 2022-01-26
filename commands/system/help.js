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

        const helpMap = new Map();
        const commands = client.commands.map(c => c).filter(c => c.help);
        commands.forEach(command => {
            const commandCategorie = command.help.split("/").shift();
            const commandHelp = command.help.split("/").slice(1).shift();

            if(!helpMap.has(commandCategorie)){
                helpMap.set(commandCategorie, []);
            }
            helpMap.get(commandCategorie).push(commandHelp);
        });


        let newMessage = "";

        helpMap.forEach((helps, commandCategorie) => {
            newMessage += commandCategorie + ":\n";
            helps.forEach(help => newMessage += help + ", ");
            newMessage = newMessage.slice(0, -2);
            newMessage += "\n\n";
        });

        newMessage = newMessage.trim();

        message.channel.send(newMessage);
        console.log("help");
    }
}