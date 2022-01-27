const directory = __dirname.slice(__dirname.lastIndexOf('/')+1);

module.exports = {
    name: "test",
    description: "test",
    execute(client, message, args){
        console.log("test");
    }
}