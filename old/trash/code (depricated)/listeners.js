var message, arg, cmd;
function txt(i) {
	return arg.slice(i).join(' ');
}

var bot_enabled = true;
var cmdchars = ['!'];

client.on('message', m => {
	if (!bot_enabled && !ops.includes(m.author.id)) return;

	if (cmdchars.includes(m.content.substr(0,1))) {

		var a = m.content.split(' ');
		var t = function(i) {return a.slice(i).join(' ');}

		message = m; arg = a;
		cmd = a[0].slice(1).toLowerCase();

		// General
		if (cmd === "help") helpc(m,a,t);
		if (cmd === "test") testc(m,a,t);
		if (cmd === "say") sayc(m,a,t);
		if (cmd === "report") reportc(m,a,t);
		if (cmd === "pin") pinc(m,a,t);
		if (cmd === "createnote" || cmd === "cn") newnotec(m,a,t);
		if (cmd === "feature-request" || cmd === "idea") featurerequestc(m,a,t);
		// Admin
		if (ops.includes(m.author.id)) {
			if (cmd === "eval" || cmd === ">") evalc(m,a,t);
			if (cmd === "exec" || cmd === "$") execc(m,a,t);
//			if (cmd === "reloadmusic") reloadmusicc(m,a,t);
			if (cmd === "addbots") addbotsc(m,a,t);
		}

/*		// Music
		if (m.guild) {
			if (cmd === "join") joinc(m,a,t);
			if (cmd === "leave") leavec(m,a,t);
//			if (cmd === "play" || cmd === 'p') playc(m,a,t);
			if (cmd === "play" || cmd === 'p') m.channel.send('play command is out of service; use playaudio or playmidi instead');
			if (cmd === "playaudio" || cmd === 'pa') playaudioc(m,a,t);
			if (cmd === "playmidi" || cmd === 'pm') playmidic(m,a,t);
			if (cmd === "search" || cmd === 's') searchc(m,a,t);
			if (cmd === "upload" || cmd === 'u') uploadc(m,a,t);
			if (cmd === "ytplay" || cmd === "ytp" || cmd === "pyt" || cmd === "py") youtubedlplayc(m,a,t);
			if (cmd === "ytdl") youtubedlc(m,a,t);
			if (cmd === "soundfontcfg") soundfontcfgc(m,a,t);
			if (cmd === "soundfonts") soundfontsc(m,a,t);
			if (cmd === "setsoundfonts") setsoundfontc(m,a,t);
			// Song control (when song is playing)
			if (typeof dispatcher !== 'undefined') {
				if (cmd === "song") songc(m,a,t);
				if (cmd === "pause") pausec(m,a,t);
				if (cmd === "resume") resumec(m,a,t);
				if (cmd === "volume") volumec(m,a,t);
				if (cmd === "time") timec(m,a,t);
				if (cmd === "stop") stopc(m,a,t);
			}
		}*/

		/* // Fishing
		if (m.channel.id === "332984202436018176"){
			if (cmd === "fish" || cmd === "cast") fishc(m,a,t);
			if (cmd === "sack") sackc(m,a,t);
			if (cmd === "eat") eatc(m,a,t);
		} */



		// if (cmd === "") (m,a,t);
	}

	if (m.content.substr(0,1) === "?") {
		let cmd = m.content.split(' ')[0].slice(1).toLowerCase();
		for (var note in notes) {
			if (note === cmd) m.channel.send(notes[note]);
		}
	}


	if (m.content.toLowerCase() === "ping") m.channel.send('pong');

});

var ignored_channels = [
	"303023485582704641", // #minecraft
	"303023627157110784" // #mc-console
];


function log(thing){
	var date = new Date();
	var timestamp = date.toLocaleDateString() + " " + date.toLocaleTimeString() + " - ";
	var line = timestamp+thing;
	console.log(line);
	fs.appendFile('console.log', line+'\n');
}

client.on('message', (message) => {
	if (!ignored_channels.includes(message.channel.id)) {
		log(`${message.id} ${message.author.tag}: ${message.content}`);
	}
});
client.on('messageDelete', (message) => {
	if (!ignored_channels.includes(message.channel.id)) {
		log(`[INFO] Message ${message.id} has been deleted.`);
	}
});
client.on('messageDeleteBulk', (messages) => {
	if (!ignored_channels.includes(message.channel.id)) {
		log(`[INFO] Messages have been bulk-deleted: ${messages.array()}`);
	}
});
client.on('messageReactionAdd', (messageReaction, user) => {
	if (!ignored_channels.includes(messageReaction.message.channel.id)) {
		log(`[INFO] ${user.tag} reacted to message ${messageReaction.message.id} with :${messageReaction.emoji.name}:`);
	}
});
client.on('messageReactionRemove', (messageReaction, user) => {
	if (!ignored_channels.includes(messageReaction.message.channel.id)) {
		log(`[INFO] ${user.tag} removed reaction :${messageReaction.emoji.name}: from message ${messageReaction.message.id}`);
	}
});
client.on('messageReactionRemoveAll', (message) => {
	if (!ignored_channels.includes(message.channel.id)) {
		log(`[INFO] All reactions on message ${message.id} have been removed.`);
	}
});
client.on('messageUpdate', (oldMessage, newMessage) => {
	if (!ignored_channels.includes(newMessage.channel.id)) {
		log(`[INFO] Message ${oldMessage.id} has been edited; new content: ${newMessage.content}`);
	}
});
client.on('channelPinsUpdate', (channel) => {
	if (!ignored_channels.includes(channel.id)) {
		log(`[INFO] Pinned messages in #${channel.name} have been updated.`);
	}
});



client.on('guildBanAdd', (guild, user) => {
	log(`${user.tag} has been BANNED!!!`.magenta);
});
client.on('guildBanRemove', (guild, user) => {
	log(`${user.tag} has been unbanned.`.magenta);
});
client.on('guildMemberAdd', (member) => {
	log(`${member.user.tag} has joined our guild!`.magenta);
	// Give them a random color
	member.guild.createRole({
	    name: 'Color',
	    color: 'RANDOM',
	    permissions: []
	}).then(thisrole => {
		thisrole.setPosition(defaultguild.roles.get('322844492715786242').position);
	    member.addRole(thisrole);
	});
	if (member.user.bot) {
		member.addRole(defaultguild.roles.get('303030983983104010'));
	} else {
		member.addRole(defaultguild.roles.get('334841644308234241'));
	}
});
client.on('guildMemberRemove', (member) => {
	log(`${member.user.tag} has left our guild.`.magenta);
});
client.on('channelCreate', (channel) => {
	if (!ignored_channels.includes(channel.id)) {
		log(`A new channel has been created. Type:${channel.type} ID:${channel.id} Name:${channel.name} `.magenta);
	}
});
client.on('channelDelete', (channel) => {
	if (!ignored_channels.includes(channel.id)) {
		log(`A channel has been deleted. Type:${channel.type} ID:${channel.id} Name:${channel.name} `.magenta);
	}
});
/*client.on('channelUpdate' (oldChannel, newChannel) => {
	if (!ignored_channels.includes(channel.id)) {
		log(newChannel.guild, `A channel has been updated. Type:${newChannel.type} ID:${newChannel.id} Name:${newChannel.name} `)
	}
});*/
client.on('emojiCreate', (emoji) => {
	log(`An emoji has been created. Name:${emoji.name} URL:${emoji.url}`.magenta);
});
client.on('emojiDelete', (emoji) => {
	log(`Emoji :${emoji.name}: has been deleted. Name:${emoji.name} URL:${emoji.url}`.magenta);
});
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
	log(`Emoji :${oldEmoji.name}: was renamed to :${newEmoji.name}:`.magenta);
});






client.on('guildCreate', (guild) => {
	log(`Client has joined a new guild "${guild.name}"; ID ${guild.id}`.magenta);
});

client.on('guildDelete', (guild) => {
	log(`Client has left the guild "${guild.name}"; ID ${guild.id}`.magenta);
});



client.on('disconnect', (event) => {
	log('Websocket Disconnected'.magenta);
});

client.on('reconnecting', () => {
	log('Reconnecting to WebSocket'.magenta);
});

client.on('resume', (replayed) => {
	log(('WebSocket resumed. '+replayed).magenta)
});

client.on('warn', (info) => {
	log(('Warn: '+info).magenta);
});

//client.on('debug', (info) => {
//	log('Debug: '+info);
//});
