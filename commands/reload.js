commands.load = {
    restrictedTo: 1,
    usage: "<command(s)...>/config",
    execute: function (message, args, txt) {
        if (args[1]) {
            if (args[1] === "config") {
                config = JSON.parse(fs.readFileSync('config.json','utf8'));
                message.react('🆗');
            } else {
                args.slice(1).forEach(command => {
                    fs.readFile(`commands/${command}.js`, 'utf8', (err,data) => {
                        if (err) return message.react('⚠');
                        try {eval(data)} catch(e) {
                            console.error(`Invalid command ${command}: ${e}`.red);
                            message.react('⚠');
                            return;
                        }
                        message.react('🆗');
                    });
                });
            }
        } else message.react('❓');
    }
}