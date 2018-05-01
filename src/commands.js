global.commands = {};

commands.help = {
    aliases: ["robot", "commands"],
	usage: "[command name]",
    description: "Shows command list or details on a command.",
    execute: function (message, args, txt) {
        if (args[1]) {
            const commandName = args[1];
            const command = commands[commandName];
            if (!command) return message.react('❓');
            const str = 
				'`!' + (commandName + ' ' + (command.usage || '')).trim() + '`\n'
				+ (command.hasOwnProperty('aliases') ? `**Aliases:** \`${command.aliases.join(', ')}\`` : '')
				+ '\n\n'
				+ (command.description || '(no description)');
            message.channel.send(str);
        } else {
            let str =
            "**About Terrium Bot**\n" +
            "The Terrium Discord Bot is the official bot of the Terrium Community Discord Server.\n" +
            "Below are the available commands. Use `!help <command>` for more information on a command, for example, `!help color`.\n" +
            "Commands can be used in a direct message.";

            const commandArray = [];
            const modCommandArray = [];
            for (const commandName in commands) {
                const command = commands[commandName];
                if (command.hidden) continue;
                if (!command.hasOwnProperty('restrictedTo')) commandArray.push(`!${commandName}`);
                else if (command.restrictedTo >= 2) modCommandArray.push(`!${commandName}`);
            }

            if (commandArray.length > 0) str += `\n\n**General Commands**\n${commandArray.join(', ')}`
            if (hasPermission(message.member, 2) && modCommandArray.length > 0) str += `\n\n**Moderator Commands**\n${modCommandArray.join(', ')}`

            message.channel.send(str);
        }
    }
};




/*
fs.readdir('commands', (err, fileNames) => {
	fileNames.forEach(fileName => {
		if (fileName.startsWith('~') || !fileName.endsWith('js')) return;
		fs.readFile('commands/'+fileName, 'utf8', (err, data) => {
			if (err) return console.error(colors.red(err));
			try {eval(data)} catch(e) {console.error(`Invalid command ${fileName}: ${e}`.red)}
		});
	});
});*/



client.on("message", function(message){
    if (!message.content.startsWith("!")) return;

    const args = message.content.split(' ');
	const cmd = args[0].slice(1).toLowerCase();
    const txt = i => {return args.slice(i).join(' ')};
    
    message.args = args;
    message.cmd = cmd;
    message.txt = i => {return this.args.slice(i).join(' ')};

    for (const commandName in commands) {
        const command = commands[commandName];
        if (cmd === commandName || (command.aliases && command.aliases.includes(cmd))) {
            if (command.guildOnly && !message.guild) return message.reply('🚫 **This command cannot be used in a DM.**');

            if (!message.guild) message.guild = client.guilds.get(config.guild);
            if (!message.member) message.member = client.guilds.get(config.guild).members.get(message.author.id);
            if (command.op && message.author.id != config.op) return message.react('🚫');
            if (command.hasOwnProperty('restrictedTo')) { //todo deprecate
                if (!hasPermission(message.member, command.restrictedTo)) return message.react('🚫');
            }
            if (command.hasOwnProperty('require')) {
                for (let flag of command.require) {
                    if (!message.member.hasPermission(flag)) return message.react('🚫');
                }
            }

            try {
                command.execute(message, args, txt);
            } catch (error) {
                message.reply('💥 **An error has been encountered while processing your command.** 💥');
                console.error(colors.red(error.stack));
            }
        }
    }
});