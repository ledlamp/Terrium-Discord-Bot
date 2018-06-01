commands.exec = {
    aliases: ["$"],
    restrictedTo: 0,
    execute: function (message, args, txt) {
        child_process.exec(txt(1), function (error, stdout, stderr) {
            if (stdout) supersend('**stdout:** ' + stdout, message.channel);
            if (stderr) supersend('**stderr:** ' + stderr, message.channel);
        });
    }
}