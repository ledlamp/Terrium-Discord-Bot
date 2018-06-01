var reporthook = new Discord.WebhookClient('325389793082998794','MwcY9FewIVFWHEQkGK7moClwonD-MMM_I_c_MoL1E82_qnNF-zi4nOR1D5_7I7Jf1c9C');

function helpc(message,arg,txt){
	message.channel.send('http://gg.gg/terrium-bot-command-list');
}
function testc(message, arg, txt) {message.react('🐶');}
function sayc(message, arg, txt) {message.channel.send(txt(1));}
function reportc(message, arg, txt) {
	if (!arg[1]) {message.channel.send('Usage: `!report <someone> <for something>`');} else {
		reporthook.send('**Date:** '+Date()+'\n**Submitted by:** '+message.author.username+'\n**Reported user:** '+arg[1]+'\n**Content:** ```\n'+txt(2)+'\n```');
		message.channel.send('Report sent.');
	}
}
function pinc(message, arg, txt) {message.channel.fetchMessage(arg[1]).then(msg => {msg.pin();});}
function featurerequestc(message,arg,txt){
	client.users.get('281134216115257344').send('**Feature Request** from '+message.author.tag+': '+txt(1));
	message.react('🆗');
}


fs.readFile('./notes.json', 'utf8', (err, data) => {
	notes = JSON.parse(data);
});
function newnotec(message,arg,txt){
	if (arg[1]) {
		if (!notes[arg[1]]) {
			notes[arg[1]] = txt(2);
			fs.writeFile('./notes.json', JSON.stringify(notes));
			message.react('🆗');
		} else {
			message.react('⚠');
		}
	} else {
		message.reply('**Usage:** `!createnote <name> <content...`');
	}
}



//Admin
function evalc(message, arg, txt) {
	try {supersend('`'+eval(txt(1))+'`', message.channel);}
	catch (error) {supersend('`'+error+'`', message.channel);}
}
function execc(message, arg, txt) {
	child_process.exec(txt(1), function (error, stdout, stderr) {
		supersend('**stdout:** ' + stdout, message.channel);
		if (stderr !== null) {
			supersend('**stderr:** ' + stderr, message.channel);
		}
	});
}
//if (cmd == 'spam' && tx2) {for (t = 0; t < arg[1]; t++) {message.channel.send(tx2);}}





/*
 var mpphook = new Discord.WebhookClient('337455329828929537','54xhKAkxgE9sJyAKd0bn5V8feNhGEffq0HgJhY1snQA7rERLJWqOX3wS1KNglXTjMz9w');


client.on('ready', ()=>{
	Client = require('/home/me/MPPclient.js');

	gClient = new Client("ws://www.multiplayerpiano.com:443");
	gClient.setChannel("lobby");
	gClient.start();

	var channel = defaultguild.channels.get('337380378048331778');

	gClient.on('a', msg => {
		if (msg.p._id !== gClient.getOwnParticipant()._id) {
			mpphook.send(("**"+msg.p.name+":** "+msg.a).replace(/@everyone/g, "@everyone".trap).replace(/@here/g, "@here".trap));
		}
	});

	client.on('message', message => {
		if (message.author.id !== "337455329828929537" && message.channel === channel)
			gClient.sendArray([{m:"a", message: message.member.displayName+": "+message.content.substr(0,512)}]);
	});
});
*/
