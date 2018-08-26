commands.clear = {
	aliases: ["flush", "blank", "kruncherthingy"],
	description: "Flushes the chat with a tall message of blankness",
	execute: function (message) {
		message.channel.send(`\u2063${'\n'.repeat(1998)}\u2063`);
	}
}