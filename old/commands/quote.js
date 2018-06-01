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
        channel.fetchMessage(args[1]).then(m => {
            var embed = new Discord.RichEmbed()
            .setAuthor((m.member && m.member.displayName) || m.author.username, m.author.avatarURL)
            .setDescription(m.cleanContent)
            .setTimestamp(m.createdAt);
            if (channel.id !== message.channel.id) embed.setFooter(`From channel #${channel.name}`);
			if (m.member) embed.setColor(m.member.displayColor);
            if (m.attachments.first()) {
                if (m.attachments.first().width) embed.setImage(m.attachments.first().url);
                else embed.addField('Attachment:', m.attachments.first().url);
            }
            message.channel.send({embed});
        }, () => message.react('⚠'));
    }
}