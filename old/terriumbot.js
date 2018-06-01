console.log('Starting');
const Discord = require('discord.js');
const fs = require('fs');
const child_process = require('child_process');
const colors = require('colors');
const Color = require('./Color.js');
const request = require('request');
const client = new Discord.Client();
let config = JSON.parse(fs.readFileSync('config.json','utf8'));
client.login(config.token);

const botClients = [];

const commands = {};
fs.readdir('commands', (err, fileNames) => {
	fileNames.forEach(fileName => {
		if (!fileName.endsWith('js')) return;
		fs.readFile('commands/'+fileName, 'utf8', (err, data) => {
			if (err) return console.error(colors.red(err));
			try {eval(data)} catch(e) {console.error(`Invalid command ${fileName}: ${e}`.red)}
		});
	});
});

fs.readFile('cards.json', 'utf8', (err, data) => cards = JSON.parse(data));

client.on('ready', () => {
	console.log('Ready');
	myguild = client.guilds.get(config.guild);
});

client.on('message', message => {
	
	const args = message.content.split(' ');
	const cmd = args[0].slice(1).toLowerCase();
	const txt = (i) => {return args.slice(i).join(' ')};
	
	// log DMs
	if (!message.guild) {
		const l = `[DM ${new Date().toLocaleString()}] ${message.author.tag}: ${message.content}`;
		console.log(l);
		fs.appendFile('dm.log', l+'\n');
	}
	else if (message.guild.id !== config.guild) return;

	// bridge to TaigaChat (experimental)
	if (message.channel.id === config.channels.main && message.member) {
		let msg = `[color=#7289DA][Discord][/color] [color=${message.member.displayHexColor}][b]${message.member.displayName}[/b]: ${message.cleanContent}[/color]`;
		const a = message.attachments.first();
		if (a) msg += a.width ? `\n[img]${a.url}[/img]` : `\n[url=${a.url}]${a.filename}[/url]`;
		request.post(
			{url: `https://terrium.net/community/taigachat/post.json?message=${encodeURIComponent(msg)}&room=1`},
			error => {if (error) console.error(error)}
		);
	}

	// bridge discord to slack
	if (message.channel.id === config.channels.slackBridge && message.member) {
		request.post({
			url: "https://hooks.slack.com/services/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",
			body: {
				text: message.cleanContent,
				username: message.member.displayName,
				icon_url: message.author.avatarURL
			},
			json: true
		}, error => {if (error) console.error(error)});
	}

	// commands
	if (message.content.startsWith("!")) {
		(function(){
			for (const commandName in commands) {
				const command = commands[commandName];
				if (cmd === commandName || (command.aliases && command.aliases.includes(cmd))) {
					if (command.guildOnly && !message.guild) return message.reply('🚫 **This command cannot be used in a DM.**');

					if (!message.member) message.member = client.guilds.get(config.guild).members.get(message.author.id);
					if (command.hasOwnProperty('restrictedTo')) {
						/*if (!(
							(message.author.id === config.op && command.restrictedTo >= 0) ||
							(message.member.roles.has(config.roles.admin) && command.restrictedTo >= 1) ||
							(message.member.roles.has(config.roles.mod) && command.restrictedTo >= 2)
						)) return message.react('🚫');*/
						if (!hasPermission(message.member, command.restrictedTo)) return message.react('🚫');
					}

					try {
						command.execute(message, args, txt);
					} catch (error) {
						message.reply('💥 **An error has been encountered while processing your command.** 💥');
						console.error(colors.red(new Error(error).stack));
					}
				}
			}
		})();
	}

	// cards
	if (message.content.startsWith('?')) {
		for (const cardName in cards) {
			if (cardName === cmd) message.channel.send(cards[cardName]);
		}
	}

	// ping pong
	if (message.content.toLowerCase().substr(1,4) === "ing") {
		message.channel.send(message.content.substr(0,1) + (message.content[1] === 'I' ? 'O' : 'o') + message.content.substr(2,4));
	}

});



// Handle new members
client.on('guildMemberAdd', member => {
	if (member.guild.id !== config.guild) return;

	// restore their roles if returning member
	try {
		const userdata = JSON.parse(fs.readFileSync(`./userdata/${member.id}.json`, 'utf8'));
		if (userdata.backup.roles) {
			userdata.backup.roles.forEach(role => {
				const existingRole = member.guild.roles.get(role.id);
				if (existingRole) return member.addRole(existingRole);
				member.guild.createRole({
					name: role.name,
					color: role.color,
					permissions: role.permissions,
					position: role.position
				}).then(role => member.addRole(role));
			});
			return;
		}
		if (userdata.backup.nickname) member.setNickname(userdata.backup.nickname);
	} catch(e){}

	// otherwise
	// create their color role
	member.guild.createRole({
	    name: '[]',
	    color: 'RANDOM',
		permissions: [],
		position: member.guild.roles.get(config.roles.colorHeader).position
	}).then(role => member.addRole(role));

	// sort
	if (member.user.bot) {
		member.addRole(member.guild.roles.get(config.roles.robots));
	} else {
		member.addRole(member.guild.roles.get(config.roles.humans));
	}


});

// Handle member quits
client.on('guildMemberRemove', member => {
	if (member.guild.id !== config.guild) return;

	// save member data
	fs.readFile(`./userdata/${member.id}.json`, 'utf8', (err, data) => {
		const userdata = data ? JSON.parse(data) : {};
		userdata.backup = {roles:[]};
		member.roles.array().forEach(role => {
			if (role.id === myguild.defaultRole.id) return;
			userdata.backup.roles.push({
				id: role.id,
				name: role.name,
				color: role.color,
				position: role.position,
				permissions: role.permissions
			});
		});
		userdata.backup.nickname = member.nickname;
		fs.writeFile(`./userdata/${member.id}.json`, JSON.stringify(userdata));
	});

	// delete their color role
	const colorRole = findColorRole(member);
	if (colorRole && colorRole.members.array().length === 0) colorRole.delete();

});


// Magic voice text channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	let oldIsInVoice = (oldMember.voiceChannel && oldMember.voiceChannel.id === config.channels.voiceChat) || false;
	let newIsInVoice = (newMember.voiceChannel && newMember.voiceChannel.id === config.channels.voiceChat) || false;
	if (newIsInVoice && !oldIsInVoice) {
		client.channels.get(config.channels.voiceChatText).overwritePermissions(newMember, {'READ_MESSAGES': true});
	}
	if (oldIsInVoice && !newIsInVoice) {
		client.channels.get(config.channels.voiceChatText).overwritePermissions(newMember, {'READ_MESSAGES': false});
	}
});




// slack to discord
(function(){
	const slackhook = new Discord.WebhookClient("370784120759910402", "xPSRgJxxWvOeoESmYrJfSxAOKQYICiBiyvlpRS2tUN-xJSVkH8rgX9YmtMiu4gGy-RhI");
	
	const express = require('express');
	const bodyParser = require('body-parser');
	const app = express();

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.post('/', (req, res) => {
		res.end();
		if (req.body.user_name === "slackbot") return;
		slackhook.send(req.body.text, {
			username: req.body.user_name,
		});
	});

	app.listen(2797);
})();
























// Utility Functions

////////////////////////////////////////////////////////////////////////////////

Array.prototype.random = function () {
	return this[Math.floor(Math.random()*this.length)];
} // if problems try get below to work

/*Object.defineProperty(Array.prototype, 'random', {
    value: function(array) {array[Math.floor(Math.random()*array.length)];}
});*/

function chunkSubstr(str, size) {
  var numChunks = Math.ceil(str.length / size),
      chunks = new Array(numChunks);
  for(var i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }
  return chunks;
}

function supersend(input, channel) {
	if (input.length > 2000) {
		let chunks = chunkSubstr(input, 2000);
		chunks.forEach(function(chunk) {
			channel.send(chunk);
		});
	} else {
		channel.send(input);
	}
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function findColorRole(member) {
	return member.roles.find(role => {if (role.name.startsWith('[') && role.name.endsWith(']')) return role});
}

function hasPermission(member, value) {
	return (
		(member.user.id === config.op && value >= 0) ||
		(member.roles.has(config.roles.admin) && value >= 1) ||
		(member.roles.has(config.roles.mod) && value >= 2)
	)
}

////////////////////////////////////////////////////////////////////////////////
client.on('error', error => console.error(error));