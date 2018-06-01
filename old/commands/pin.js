commands.pin = {
    usage: "<message IDs...>",
    description: "Pins messages by ID.",
    execute: function (message, args) {
        args.shift();
        if (!args[0]) return message.react('⚠');
        args.forEach(id => {
            message.channel.fetchMessage(id).then(message => {
                message.pin();
            });
        });
    }
}