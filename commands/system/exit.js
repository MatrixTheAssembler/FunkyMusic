const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "exit",
    help: `${directory}/exit`,
    description: "exits bot",
    aliases: ["e"],
    execute(client, message, args){
        console.log("exit");
        client.destroy();
    }
}