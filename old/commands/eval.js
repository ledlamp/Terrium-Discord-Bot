commands.eval = {
    aliases: [">"],
    restrictedTo: 0,
    execute: function (message, args, txt) {
        try {
            supersend('`'+eval(message.content.substr(args[0].length))+'`', message.channel);
        }
        catch (error) {
            supersend('`'+error+'`', message.channel);
        }
    }
}