process.on('unhandledRejection', (error) => {
	console.error(error.stack);
});

global.Discord = require('discord.js');
global.fs = require('fs');
global.colors = require('colors');

global.client = new Discord.Client({disableEveryone:true});
client.on('warn', console.warn);
client.on('error', error => console.error(error.stack));

global.config = require('./config.json');
client.login(config.token);






client.once('ready', () => {
	console.log('Ready');
	myguild = client.guilds.cache.get(config.guild); //todo deprecate?

});



require('./util.js')
require('./commands.js')
require('./datamanager.js')
require('./rolemanager.js')
require('./general-commands.js')
require('./misc.js')
require('./bots.js')








client.on('message', message => {
	
	// log DMs
	if (!message.guild) {
		const l = `[DM ${new Date().toLocaleString()}] ${message.author.tag}: ${message.content}`;
		console.log(l);
		//fs.appendFile('dm.log', l+'\n');
	}

});


