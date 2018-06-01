console.log('Starting');
const Discord = require('discord.js');
const fs = require('fs');
const download = require('download-file');
const youtubedl = require('youtube-dl');
const exec = require('child_process').exec;
const client = new Discord.Client();
/* token -> */																																																							client.login('MzI5MDk2MDQwNjQyOTA0MDY0.DDNfFw.eA6xY34SjweeKkImAp-xtcnHELU');

const ops = [
	"281134216115257344"
];

client.on('ready', () => {
	console.log('Ready');
	fs.appendFileSync('chat.log', "~reloaded~\n");
	defaultguild = client.guilds.get('279769632599048193');
	defaultvoice = defaultguild.channels.get('279769632599048194');
	defaultvoice.join().then(c => {connection = c;});
});

client.on('message', message => {
	arg = message.content.split(' ');
	cmd = arg[0].toLowerCase();
	txt = message.content.substr(arg[0].length+1).trim();
	if (arg[1]) {tx2 = message.content.substr(arg[0].length+arg[1].length+2).trim();}
	if (arg[2]) {tx3 = message.content.substr(arg[0].length+arg[1].length+arg[2].length+3).trim();}
	say = function(i) {message.channel.send(i);}
});

eval(
	 fs.readFileSync('./modules/utility-functions.js')
	+fs.readFileSync('./modules/logging.js')
	+fs.readFileSync('./modules/general.js')
	+fs.readFileSync('./modules/music.js')
	+fs.readFileSync('./modules/sockets.js')
);
