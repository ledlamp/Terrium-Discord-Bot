console.log('Starting');
const Discord = require('discord.js');
const fs = require('fs');
const child_process = require('child_process');
const colors = require('colors');
const client = new Discord.Client();
/* token -> */																																																							client.login(/* token redacted */);

const ops = ["281134216115257344"];
var bot_enabled = true;
var reporthook = new Discord.WebhookClient('325389793082998794','MwcY9FewIVFWHEQkGK7moClwonD-MMM_I_c_MoL1E82_qnNF-zi4nOR1D5_7I7Jf1c9C');
fs.readFile('./?cmds.json', 'utf8', (err, data) => { notes = JSON.parse(data) });


client.on('ready', () => {
	console.log('Ready');
	guild = client.guilds.get('279769632599048193');
	voiceChannel = client.channels.get('279769632599048194');
});


////////////////////////////////////////////////////////////////////////////////

// Main stuff
client.on('message', message => {
	if (!bot_enabled && !ops.includes(message.author.id)) return;

	var arg = message.content.split(' ');
	var cmd = arg[0].slice(1).toLowerCase();
	var txt = function(i) {return arg.slice(i).join(' ')};

	if (message.content.startsWith("!")) {
		if (cmd === 'help' || cmd === 'robot') {
			message.react('📨');message.react('👌');
			message.author.send({embed:{
				author: {name: 'Terrium Bot Commands', icon_url: client.users.get('329096040642904064').avatarURL},
				color: 255,
				fields: [
					{name: '!help', value: 'See the commands'},
					{name: '!get <id>', value: 'Quotes the message with the given ID.'},
					{name: '!pin <id>', value: 'Pins the message with the given ID.'},
					{name: '!createcmd <cmd> <content>', value: 'Creates a command that can be called with `?cmd` to get the `content`.'},
					{name: '!report <user> <message>', value: 'Sends a `message` to the staff about the specified `user`.'},
					{name: '!feature-request <message>', value: 'Submit a feature request/idea for the bot(s)!'}
				]
			}});
			message.author.send({embed:{
				author: {name: 'Music Commands', icon_url: client.users.get('338197950859575308').avatarURL},
				color: 16744192,
				fields: [
					{name: '!play <query>', value: "Plays something... If there's no arguments, a random audio or MIDI will be played. If the input matches a MIDI or audio filename, that will be played; if not, it'll search it and pick a random result."},
					{name: '!playaudio/!playmidi <query>', value: "	Like play, but restricted to audio and MIDI, respectively. If no args are given, a random file is picked. If the inputted filename doesn't exist, it is searched and a random result is played."},
					{name: '!search <query>', value: 'Searches the Audio and MIDI collections. All files that include the query are returned.'},
					{name: '!upload', value: 'Adds the attached file to the Audio, MIDI, or soundfont collection.'},
					{name: '!ytplay <query>', value: 'Plays something from YouTube.'},
					{name: '!ytdl <query>', value: 'Adds music from YouTube to the audio collection.'},
					{name: '!leave', value: 'Disconnects the bot from voice'},
					{name: '!song, !pause, !resume, !volume, !time, and !stop', value: 'These commands control a playing song.'}
				]
			}});
			message.author.send({embed:{
				author: {name: 'Fishing Commands', icon_url: client.users.get('339146231911546882').avatarURL},
				color: 3329330,
				description: "F̲i̲s̲h̲i̲n̲g̲: !fish, !cast (starts fishing), !reel (stops fishing), !caught [name] (shows fish you've caught), !eat (eats one of your fish), !give [name] (gives fish to someone else), !give_[number] [name] (give up to 100 at a time), !pick (picks fruit from the tree)"
			}});
			message.author.send({embed:{
				author: {name: 'Mee6 Commands', icon_url: client.users.get('159985870458322944').avatarURL},
				color: 35255,
				description: "**Custom Commands**\n   **!test** \n**Levels**\n   **!rank** Get a player info and rank\n   **!levels** Get a link to the server leaderboard\n**Moderator**\n   **!mute** \n   **!clear_num** \n   **!clear_user** \n   **!unmute** \n   **!slowmode** \n   **!slowoff** \n**Search**\n   **!urban dank_word** \n   **!manga manga_name** \n   **!imgur some_dank_search_value** \n   **!pokemon pokemon_name** \n   **!twitch streamer_name** \n   **!youtube video_name**"
			}});
			message.author.send('**The command list was last updated on 7/27/17.**');
		}
		if (cmd === 'test') message.react('🐶');
		if (cmd === 'say') message.channel.send(txt(1));
		if (cmd === 'pin') message.channel.fetchMessage(arg[1]).then(m=>{m.pin()});
		if (cmd === 'get') {
			if (arg[1]) {
				message.channel.fetchMessage(arg[1]).then(m => {
					var embed = new Discord.RichEmbed()
					.setAuthor(m.author.tag, m.author.avatarURL)
					.setColor(m.member.colorRole.color)
					.setDescription(m.content)
					.setFooter(m.id)
					.setTimestamp(m.createdAt);
					if (m.attachments.first()) {
						if (m.attachments.first().width) embed.setImage(m.attachments.first().url);
						else embed.addField('Attachment:', m.attachments.first().url);
					}
					message.channel.send({embed});
				}, e => {message.react('⚠')});
			} else {
				message.channel.send('**!get:** Fetches a message from the channel using the given ID, and displays it as a quote.\n**Example:** `!get 280106319690596352`');
			}
		}
		if (cmd === 'report') {
			if (!arg[1]) {message.channel.send('Usage: `!report <someone> <for something>`');} else {
				reporthook.send('**Date:** '+Date()+'\n**Submitted by:** '+message.author.username+'\n**Reported user:** '+arg[1]+'\n**Content:** ```\n'+txt(2)+'\n```');
				message.channel.send('Report sent.');
			}
		}
		if (cmd === 'feature-request' || cmd.startsWith('idea')) {
			client.users.get('281134216115257344').send('**Feature Request** from **'+message.author.tag+'**: '+txt(1));
			message.react('📨');
		}
		if (cmd === 'createcmd' || cmd === 'createcmd' || cmd === 'save') {
			if (arg[1]) {
				if (!notes[arg[1]]) {
					notes[arg[1]] = txt(2);
					fs.writeFile('./?cmds.json', JSON.stringify(notes));
					message.react('🆗');
				} else {
					message.react('⚠');
				}
			} else {
				message.reply('**Usage:** `!createcmd <name> <content...`');
			}
		}

		// Admin
		if (cmd === 'eval' || cmd === '>') {
			if (ops.includes(message.author.id)) {
				try {supersend('`'+eval(txt(1))+'`', message.channel);}
				catch (error) {supersend('`'+error+'`', message.channel);}
			} else message.react('🚫');
		}
		if (cmd === 'exec' || cmd === '$') {
			if (ops.includes(message.author.id)) {
				child_process.exec(txt(1), function (error, stdout, stderr) {
					supersend('**stdout:** ' + stdout, message.channel);
					if (stderr !== null) {
						supersend('**stderr:** ' + stderr, message.channel);
					}
				});
			} else message.react('🚫');
		}
		if (cmd === 'spam') {
			if (ops.includes(message.author.id) && txt(2)) {
				for (t = 0; t < arg[1]; t++) {message.channel.send(txt(2))}
			} else message.react('🚫');
		}
		if (cmd === 'bots') {
			if (ops.includes(message.author.id)) {
				if (arg[1] == 'spawn') {
					let botTokens = [
						///* token redacted */,
						///* token redacted */,
						///* token redacted */,
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
					let botClients = {};
					function spawnBot(token, id) {
						var client = new Discord.Client();
						client.login(token);
						var connection, dispatcher;
						client.on('message', message => {
							setTimeout(function (){
								var arg = message.content.split(' ');
								var cmd = arg[0].slice(1).toLowerCase();
								var txt = function(i){return arg.slice(i).join(' ');};

								if (message.guild && ops.includes(message.author.id) && cmd == 'bots') {
									if (arg[1] == id || arg[1] == 'all') {
										if (arg[2] == 'ping') message.channel.send('pong');
										if (arg[2] == 'eval') {
											try {message.channel.send('`'+eval(txt(3).split('$id').join(id))+'`');}
											catch (error) {message.channel.send('`'+error+'`');}
										}
										if (arg[2] == 'join') {
											message.member.voiceChannel.join().then(c => {connection = c});
											message.react('🆗');
										}
										if (arg[2] == 'play') {
											message.member.voiceChannel.join().then(connection => {
												dispatcher = connection.playFile(txt(3));
											});
										}
										if (arg[2] == 'destroy') {
											message.react('🆗');
											client.destroy();
										}
									}
								}
							},id+0);
						});
						botClients[id] = client;
					}
					//function spawnBot2(token, id) {
					//	const client = new Discord.Client();
					//	client.login(token);
					//	botClients[id] = client;
					//}
					if (arg[2] === 'all') {
						botTokens.forEach(spawnBot);
						message.react('🆗');
					} else if (arg[2] === 'eval') {

					} else if (arg[2]) {
						if (arg[2] > botTokens.length) return message.react('⚠');
						let i;
						for (i = 0; i < arg[2]; i++) {
							spawnBot(botTokens[i], i);
						}
						message.react('🆗');
					} else {
						message.react('⚠');
					}
				}
			} else message.react('🚫');
		}
	}

	if (message.content.substr(0,1) === "?") {
		for (var note in notes) {
			if (note === cmd) message.channel.send(notes[note]);
		}
	}

	if (message.content.toLowerCase().substr(1,4) === "ing") {
		let o; if (message.content[1] === 'I') {o = 'O'} else {o = 'o'}
		message.channel.send(message.content.substr(0,1)+o+message.content.substr(2,4));
	}

});

// Handle new members
client.on('guildMemberAdd', (member) => {
	member.guild.createRole({
	    name: 'Color '+member.user.discriminator,
	    color: 'RANDOM',
	    permissions: []
	}).then(thisrole => {
		thisrole.setPosition(guild.roles.get('347182711095558144').position);
	    member.addRole(thisrole);
	});

	if (member.user.bot) {
		member.addRole(guild.roles.get('303030983983104010'));
	} else {
		member.addRole(guild.roles.get('334841644308234241'));
	}
});

// Magic voice text channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	let oldIsInVoice = (oldMember.voiceChannel && oldMember.voiceChannel.id === '340299884794216448') || false;
	let newIsInVoice = (newMember.voiceChannel && newMember.voiceChannel.id === '340299884794216448') || false;
	if (newIsInVoice && !oldIsInVoice) {
		client.channels.get('340300008056422412').overwritePermissions(newMember, {'READ_MESSAGES': true});
	}
	if (oldIsInVoice && !newIsInVoice) {
		client.channels.get('340300008056422412').overwritePermissions(newMember, {'READ_MESSAGES': false});
	}
});






























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
