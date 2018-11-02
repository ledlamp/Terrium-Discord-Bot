// ping pong
client.on("message", message => {
	if (message.content.toLowerCase().substr(1,4) === "ing") {
		message.channel.send(message.content.substr(0,1) + (message.content[1] === 'I' ? 'O' : 'o') + message.content.substr(2,4));
	}
});


/*// canned response things
client.on("message", message => {
	if (message.content.startsWith('?')) {
		for (const cardName in cards) {
			if (cardName === cmd) message.channel.send(cards[cardName]);
		}
	}
});*/

// todo hello goodbye
/*
client.on("guildMemberAdd", member => {

});
client.on('guildMemberRemove', member => {

});
*/


// news 2 chat
client.on('message', message => {
	if (message.channel.id != config.channels.news) return;
	
	var embed = {
		color: message.member.displayColor,
		author: {
			name: message.member.displayName,
			iconURL: message.author.displayAvatarURL(),
		},
		description: message.cleanContent,
		timestamp: message.createdAt,
	}
	
	var att = message.attachments.first()
    if (att) {
        if (att.width) embed.image = {url: att.url};
        else embed.fields = [{name:'Attachment:', value:att.url}];
    }
	
	client.channels.get(config.channels.main).send(
		`***${message.member} posted an announcement***`, {embed}
	)
});



// Magic voice text channel
client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channelID != config.channels.voiceChatText && newState.channelID == config.channels.voiceChatText) {
        // member joined the channel
        client.channels.get(config.channels.voiceChatText).overwritePermissions(newState.member, {'READ_MESSAGES': true});
    } else if (oldState.channelID == config.channels.voiceChatText && newState.channelID != config.channels.voiceChatText) {
        // member left the channel
        client.channels.get(config.channels.voiceChatText).overwritePermissions(newState.member, {'READ_MESSAGES': false});
    }
});
