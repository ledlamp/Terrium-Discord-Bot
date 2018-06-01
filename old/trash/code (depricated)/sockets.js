var socketTokens = [
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */,
	/* token redacted */
]

function deploySocket (token, id) {
	eval("\
	var client"+id+" = new Discord.Client();\
	client"+id+".login('"+token+"');\
	client"+id+".on('message', message => {\
		setTimeout(function (){\
			var arg = message.content.split(' ');\
			var cmd = arg[0].slice(1).toLowerCase();\
			var txt = function(i){return arg.slice(i).join(' ');};\
			if (message.guild && ops.includes(message.author.id) && cmd == 'bots') {\
				if (arg[1] == '"+id+"' || arg[1] == 'all') {\
					if (arg[2] == 'ping') message.channel.send('pong');\
					if (arg[2] == 'eval') {\
						try {message.channel.send('`'+eval(txt(3).split('$id$').join('"+id+"'))+'`');}\
						catch (error) {message.channel.send('`'+error+'`');}\
					}\
					if (arg[2] == 'join') {\
						message.member.voiceChannel.join()\
						.then(connection => {\
							VoiceConnection"+id+" = connection;\
						});\
						message.react('🆗');\
					}\
					if (arg[2] == 'play') {\
						if (typeof VoiceConnection"+id+" !== 'undefined') {\
							let path = './music/'+txt(3).split('/').join(':');\
							if (fs.existsSync(path)) {\
								dispatcher"+id+" = VoiceConnection"+id+".playFile(path);\
								message.react('🆗');\
								dispatcher"+id+".on('end', () => {\
									dispatcher"+id+" = undefined;\
								});\
							} else {\
								message.react('⚠');\
							}\
						} else {message.react('⚠');}\
					}\
					if (arg[2] == 'kill') {\
						message.react('🆗');\
						client"+id+".destroy();\
					}\
				}\
			}\
		},"+id+"0);\
	});\
	");
}


function addbotsc(message, arg, txt) {
	if (arg[1] == 'all') {
		socketTokens.forEach(deploySocket);
		message.react('🆗');
	} else if (arg[1]) {
		if (arg[1] > socketTokens.length) {message.react('🚫'); return;}
		let i;
		for (i = 0; i < arg[1]; i++) {
			deploySocket(socketTokens[i], i);
		}
		message.react('🆗');
	} else {
		message.react('⚠');
	}
}
