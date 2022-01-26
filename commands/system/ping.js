module.exports = {
    name: "ping",
    help: "system/ping",
    description: "returns pong",
    execute(client, message, args){
        message.channel.send("pong");
        console.log("pong");
    }
}