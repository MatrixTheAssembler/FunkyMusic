module.exports = {
    name: "help",
    description: "Shows all commands or description of one command.",
    help: "help [command]",
    aliases: ["?", "h"],
    execute(client, message, args){
        if(args.length){
            const name = client.commands.get(args[0]);
            const alias = client.aliases.get(args[0]);
            
            if(!(name || alias)){
                message.channel.send(`${args[0]} is not a command`)
                console.log(`help ${args[0]} is not a command`)
                return;
            }

            const command = name || alias;

            const aliases = [...new Set([...[command.name], ...command.aliases])].sort().join(", ");

            const newMessage = `description: ${command.description}\naliases: ${aliases}`;

            message.channel.send(newMessage);
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

        newMessage += "<...> = arguments are a must\n[...] = arguments are optional\n| = or";

        message.channel.send(newMessage);
        console.log("help");
    }
}