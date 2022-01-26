module.exports = {
    name: "exit",
    help: "system/exit",
    description: "exits bot",
    aliases: ["e"],
    execute(client, message, args){
        console.log("exit");
        client.destroy();
    }
}