var reporthook = new Discord.WebhookClient('325389793082998794','MwcY9FewIVFWHEQkGK7moClwonD-MMM_I_c_MoL1E82_qnNF-zi4nOR1D5_7I7Jf1c9C');

client.on('message', message => {

	if (cmd === 'ping') say('pong');
	if (cmd === 'test') message.react('🐶');
	if (cmd === 'say') say(message.content.substr(3).trim());
	if (cmd == '!report') {reporthook.send('**Date:** '+Date()+'\n**Submitted by:** '+message.author.username+'\n**Reported user:** '+arg[1]+'\n**Content:** ```\n'+tx2+'\n```'); say('Report sent.');}
	if (cmd == "!pin") message.channel.fetchMessage(arg[1]).then(msg => {msg.pin();});

	// Admin
	if (isOp(message.author.id)) {
		if (cmd === 'eval') {
			try {say('`'+eval(message.content.substring(4).trim())+'`');}
			catch (error) {say('`'+error+'`');}
		}
		if (cmd === "exec")
			exec(txt, function (error, stdout, stderr) {
				message.channel.send('**stdout:** ' + stdout);
				message.channel.send('**stderr:** ' + stderr);
				if (error !== null) {
					message.channel.send('**exec error:** ' + error);
			}
		});
		if (cmd == 'spam' && tx2) {for (t = 0; t < arg[1]; t++) {say(tx2);}}
	}
});
