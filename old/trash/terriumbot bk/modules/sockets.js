var socketTokens = [
	"MzI5NDU3NDU2NjE2ODMzMDI1.DDTglw.uz9NlVg01MGAc8IUifEx4DXw7as",
	"MzI5NDU4ODU4OTExMjAzMzI4.DDTgqw.BvEd9DCQCY2Xvqy4wSVYLtxgIVg",
	"MzI5NDU4ODkxMjQxMDI5NjUy.DDTgyA.hi6cUbH4JI_fl2xDr4HRImZAPzs",
	"MzI5NDU4OTE0ODM4MTgzOTM2.DDTg1A.St-nfGKSoQCBf50bxk6FeLTVg34",
	"MzI5NDU4OTQ4MjQ5ODc4NTMw.DDTg5Q.w9gTZYEV9r5IZpEqHleXmSQ93K8",
	"MzMwNDk2MDcwMDkyMzI0ODY0.DDh19Q.QpMfXKCSyGtxCWWGgGbwMs4MhOg",
	"MzMwNDk2NTE5NzEzMDYyOTEy.DDh2YA.jwjacJB3OHfQemftIittbzcA8DU",
	"MzMwNDk5ODYxMTAxNDEyMzUy.DDh5fg.77xYch1h9QSWnr49QOr8elKe-Fw",
	"MzMwNDk5OTUyOTQ4MDE5MjAx.DDh5kg.6-gIR2GHIOQIXppHZKXSLj30Nm0",
	"MzMwNTAwMDQxMDk1NTEyMDY0.DDh5qg.48lMAxQ0I2BHK189f2ptotHS5EY"
]

function deploySocket (token, id) {
	eval("\
	const client"+id+" = new Discord.Client();\
	client"+id+".login('"+token+"');\
	client"+id+".on('message', message => {\
		setTimeout(function (){\
			if (cmd == 'ping') message.channel.send('pong');\
			if (message.guild && message.member.highestRole.name === 'Administrator' && cmd == '!s') {\
				if (arg[1] == '"+id+"' || arg[1] == 'all') {\
					if (arg[2] == 'eval') {\
						try {message.channel.send('`'+eval(tx3.split('$socketID').join('"+id+"'))+'`');}\
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
							let path = './music/'+tx3.split('/').join(':');\
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

client.on('message', message => {
	if (message.guild && message.member.highestRole.name === "Administrator" && cmd == '!sdeploy') {
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
});
