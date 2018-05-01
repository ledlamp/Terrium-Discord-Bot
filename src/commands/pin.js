commands.pin = {
    usage: "<message IDs...>",
    description: "Fetches the messages with the given IDs, and pins them. You can list multiple IDs. The messages must be in the same channel.",
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