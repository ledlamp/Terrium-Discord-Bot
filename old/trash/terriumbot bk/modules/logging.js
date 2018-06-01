function log(input) {
	var DateObject = new Date();
	var msg = DateObject.toLocaleString() + " | " + input;
	console.log(msg);
	fs.appendFileSync('chat.log', msg+"\n");
}

client.on('message', message => {
	log('[#'+message.channel.name+'] '+message.author.tag+': '+message.content);
});
