commands.spam = {
    restrictedTo: 2,
    execute: function (message, args, txt) {
        for (t = 0; t < args[1]; t++) message.channel.send(txt(2));
    }
}