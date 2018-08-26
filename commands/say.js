commands.say = {
	execute: function (message, args, txt) {
		message.channel.send(txt(1));
	}
}