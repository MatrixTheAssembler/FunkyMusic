const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "getq",
    help: `${directory}/getq`,
    description: "Lists audio in queue.",
    aliases: ["list"],
    execute(client, message, args) {
        const { voice } = message.member;
        const guildAudioQueue = client.player.getQueue(message.guild.id);

        const guildRoles = message.guild.roles.cache;
        const memberRoles = message.member._roles;
        const guildMemberRoles = guildRoles
            .filter(role => memberRoles.includes(role.id))
            .map(role => role.name.toLowerCase());
        if (!guildMemberRoles.includes("dj")) {
            message.channel.send("You need the DJ role to manipulate music.");
            console.log("Not DJ role.");
            return;
        }

        if (!voice.channel) {
            message.channel.send("You must be in a voice channel.");
            console.log("You must be in a voice channel.");
            return;
        }

        if(!guildAudioQueue || guildAudioQueue.songs.length <= 1){
            message.channel.send("No song in Queue.");
            console.log("No song in Queue.");
            return;
        }

        let newMessage = "";
        for(let i = 1; i < guildAudioQueue.songs.length; i++){
            newMessage += i + ": " + guildAudioQueue.songs[i] + "\n";

            if(newMessage.length > 1500){
                message.channel.send(newMessage);
                newMessage = "";
            }
        }

        if(newMessage.length > 0){
            message.channel.send(newMessage);
        }

        console.log("Get Queue " + guildAudioQueue.songs.length);
    }
}