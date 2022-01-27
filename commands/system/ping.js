const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "ping",
    help: `${directory}/ping`,
    description: "returns pong",
    execute(client, message, args){
        message.channel.send("pong");
        console.log("pong");
    }
}