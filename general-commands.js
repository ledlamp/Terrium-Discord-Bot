commands.eval = {
    aliases: [">"],
    op: true,
    execute: function (message, args, txt) {
        try {
            supersend('`'+eval(message.content.substr(args[0].length))+'`', message.channel);
        }
        catch (error) {
            supersend('`'+error+'`', message.channel);
        }
    }
};

commands.exec = {
    aliases: ["$"],
    op: true,
    execute: function (message, args, txt) {
        require('child_process').exec(txt(1), function (error, stdout, stderr) {
            if (stdout) supersend('**stdout:** ' + stdout, message.channel);
            if (stderr) supersend('**stderr:** ' + stderr, message.channel);
        });
    }
};

commands.say = {
	execute: function (message, args, txt) {
		message.channel.send(txt(1));
	}
};

commands.quote = {
    aliases: ["get", "fetch"],
    usage: "<message ID> [channel ID]",
    description: "Fetches and displays the message with the given id. If the message is in a different channel, the channel ID must be given as well.",
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('❓');
        if (args[2]) {
            var channel = client.channels.get(args[2]);
            if (!channel) return message.react('⚠');
        } else var channel = message.channel;
        channel.messages.fetch(args[1]).then(m => {
            var embed = {
                author: {
                    name: (m.member && m.member.displayName) || m.author.username,
                    iconURL: m.author.avatarURL()
                },
                description: m.cleanContent,
                timestamp: m.createdAt
            }
            if (channel.id !== message.channel.id) embed.footer = {text:`From channel #${channel.name}`};
			if (m.member) embed.color = m.member.displayColor;
            if (m.attachments.first()) {
                if (m.attachments.first().width) embed.image = {url:m.attachments.first().url};
                else embed.fields = [{name:'Attachment:', value:m.attachments.first().url}];
            }
            message.channel.send({embed});
        }, () => message.react('⚠'));
    }
};

commands.spam = {
    require: ["MANAGE_MESSAGES"],
    execute: function (message, args, txt) {
        for (t = 0; t < args[1]; t++) message.channel.send(txt(2));
    }
};

commands.clear = {
	aliases: ["flush", "blank", "kruncherthingy"],
	description: "Flushes the chat with a tall message of blankness",
	execute: function (message) {
		message.channel.send(`\u2063${'\n'.repeat(1998)}\u2063`);
	}
};

commands.createcard = {
    usage: "<title> <content>",
    description: 'Creates a canned response called a "card" (or whatever you want to call it cause i\'m not sure) which you can call using the `?` prefix. For example, `!createcard foo bar` makes a card titld "foo", so when you say `?foo`, the bot says `bar`.',
    execute: function (message, args, txt) {
        if (!args[1] || cards[args[1]]) return message.react('⚠');
        cards[args[1]] = txt(2);
        fs.writeFile('cards.json', JSON.stringify(cards));
        message.react('🆗');
    }
};

commands.randplex = {
    description: "Gets a link to a random Plexpedia post",
    execute: function (message, args, txt) {
        message.channel.send("http://plexpedia.com/view-" + (Math.floor(Math.random()*15000)+106) );
    }
};






commands.mute = {
	aliases: ["moot"],
    usage: "<userTag> [duration] [reason]",
	description: "Mutes the mentioned user for the given duration with the given reason.",
    require: ["MUTE_MEMBERS"],
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('❓');
        const victim = message.mentions.members.first();
        if (!victim) return message.react('⚠');
        message.delete();
        const duration = +args[2];
        const reason = txt(duration ? 3 : 2);
        victim.roles.remove(message.guild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
        victim.roles.add(message.guild.roles.get(config.roles.muted));
        if (duration) {
            setTimeout(()=>{
                victim.removeRole(message.guild.roles.get(config.roles.muted));
                victim.addRole(message.guild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
            }, duration*60*1000);
        }
        message.channel.send(`🔇 **${message.member} muted ${victim}${duration ? ` for ${duration} minute${duration == 1 ? '' : 's'}.` : "."} ${reason ? `Reason: \`${reason}\`` : ""}**`);
    }
};
commands.unmute = {
	aliases: ["unmoot"],
    arguments: "<userTag>",
    description: "unmutes the mentioned user",
    require: ["MUTE_MEMBERS"],
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('❓');
        const victim = message.mentions.members.first();
        if (!victim) return message.react('⚠');
        message.delete();
        victim.roles.remove(message.guild.roles.get(config.roles.muted));
        victim.roles.add(message.guild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
        message.channel.send(`🔈 **${message.member} unmuted ${victim}.**`);
    }
};