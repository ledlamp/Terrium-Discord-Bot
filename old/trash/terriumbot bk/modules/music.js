var music = [];
fs.readdir('./music/', function(err,files){music = files;});

function search_music(query) {
	var search_results = [];
	music.forEach(function(filename){
		if (filename.toLowerCase().includes(query.toLowerCase())) {
			search_results.push(filename);
		}
	});
	if (search_results == "") {
		return false;
	} else {
		return search_results;
	}
}
function play_music (filename, channel) {
	if (typeof channel === 'undefined') {var channel = false;}
	if (typeof connection !== 'undefined') {
		let path = './music/'+filename.split('/').join(':');
		if (fs.existsSync(path)) {
			dispatcher = connection.playFile(path);
			dispatcher.songname = filename;
			if (channel) channel.send('Now playing: `'+dispatcher.songname+'`');
			dispatcher.on('end', () => {
				if (channel) channel.send('Song ended.');
				dispatcher = undefined;
			});
			return true;
		} else {
			return false;
		}
	} else {
		if (channel) channel.send('Not connected to voice.');
		return 'Not connected to voice.';
	}
}

client.on('message', message => {
	if (!message.guild) return;

	if (cmd === '!join') {
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join().then(c => {connection = c;});
			message.react('🆗');
		} else {
			message.reply('First connect to the voice channel that you want me to connect to.');
		}
	}
	if (cmd === '!leave') {
		if (typeof connection !== 'undefined') {
			connection.disconnect();
			connection = undefined;
			message.react('🆗');
		} else {
			message.react('⚠');
		}
	}
	if (cmd === '!play') {
		if (txt != "") {
			let play = play_music(txt, message.channel);
			if (!play) {
				let search = search_music(txt);
				if (!search) {
					message.channel.send('Not found.');
				} else {
					play_music(search.random(), message.channel);
				}
			}
		} else {
			message.channel.send('Usage: `!play <filename>`');
		}
	}
	if (cmd === '!random') {
		play_music(music.random(), message.channel);
	}
	if (cmd === '!search') {
		let search = search_music(txt);
		if (!search) {
			message.channel.send('No results.')
		} else {
			message.channel.send('Search results: \n`'+search.join('\n')+'`')
		}
	}
	if (cmd === '!upload') {
		if (typeof message.attachments.first() !== 'undefined') {
			let attachment_name = message.attachments.first().filename;

			if (attachment_name.toLowerCase().endsWith('mid')) {
				let converted_name = attachment_name + '.wav';
				if (!fs.existsSync('./music/'+converted_name)) {
					message.react('🆗');
					download(message.attachments.first().url, {directory: "./midi/"}, function(err) {
						if (err) {message.channel.send('An error occurred while downloading: ```'+err+'```'); return;}
						message.channel.send('Rendering `'+attachment_name+'` to audio...');
						exec('timidity ./midi/'+attachment_name+' -Ow -o ./music/'+converted_name, function(error, stdout, stderr) {
							if (error) {message.channel.send('An error occured while converting: ```'+error+'```'); return;}
							music.push(converted_name);
							message.channel.send('MIDI conversion finished; saved to the music library as `'+converted_name+'`.\n **Conversion Log:** ```'+stdout+'```');
							if (typeof dispatcher === 'undefined') {
								play_music(converted_name, message.channel);
							}
						});
					});
				} else {
					message.channel.send('File `'+converted_name+'` already exists.');
				}
			} else {
				message.react('🆗');
				download(message.attachments.first().url, {directory: "./music/"}, function(err) {
					if (err) {message.channel.send('An error occurred while downloading: ```'+err+'```'); return;}
					music.push(attachment_name);
					message.channel.send('Added file `'+attachment_name+'` to the music library.');
					if (typeof dispatcher === 'undefined') {
						play_music(attachment_name, message.channel);
					}
				});
			}
		} else {
			message.channel.send('To upload to the music database, type `!upload` and attach the file to your message.');
		} 


	/*		if (!fs.existsSync('./music/'+attachment_name)) {
				download(message.attachments.first().url, {directory: "./music/"}, function(err) {
					if (err) {message.channel.send('An error occurred while downloading: ```'+err+'```'); return;}
					if (attachment_name.toLowerCase().endsWith('mid')) {
						message.channel.send('Rendering `'+attachment_name+'` to audio...');
						exec('timidity ./music/'+attachment_name+' -Ow -o ./music/'+attachment_name+'.wav', function(error, stdout, stderr) {
							if (error) {message.channel.send('An error occured while converting: ```'+error+'```'); return error;}
							music.push(attachment_name+'.wav');
							fs.rename('./music/'+attachment_name, './music/midi/'+attachment_name);
							message.channel.send('MIDI conversion finished; saved to the music library as `'+attachment_name+'.wav'+'`. Results: ```'+stdout+'```');
							if (typeof dispatcher === 'undefined') {
								play_music(attachment_name+'.wav', message.channel);
							}
						});
					} else {
						music.push(attachment_name);
						message.channel.send('Added file `'+attachment_name+'` to the music library.');
						if (typeof dispatcher === 'undefined') {
							play_music(attachment_name, message.channel);
						}
					}
				});
			} else {
				message.channel.send('File `'+attachment_name+'` already exists.'); }
		} else {
			message.channel.send('To upload to the music database, type `!upload` and attach the file to your message.');
		}*/
	}
	if (cmd === '!ytdl') {
		if (txt !== "") {
			message.react('🆗');
			let query = txt;
			if (!query.startsWith('http')) query = 'ytsearch:'+query;
			let video = youtubedl(query, [], {maxBuffer: Infinity});
			let video_filename;
			video.on('info', function(info) {
				message.channel.send('Downloading `'+info.filename+ '`\n Size: `'+info.size+'`');
				video.pipe(fs.createWriteStream('./music/'+info.filename));
				video_filename = info.filename;
			});
			video.on('end', function() {
				music.push(video_filename);
				message.channel.send('Download finished.');
				if (typeof dispatcher == 'undefined') {
					play_music(video_filename, message.channel);
				}
			});
		} else {
			message.reply('Usage: `!ytdl <youtube URL or search query>`');
		}
	}

	if (typeof dispatcher !== 'undefined') {

		if (cmd === '!song') {
			message.channel.send('Currently playing: `'+dispatcher.songname+'`');
		}
		if (cmd === '!pause') {
			dispatcher.pause();
			message.react('🆗');
		}
		if (cmd === '!resume') {
			dispatcher.resume();
			message.react('🆗');
		}
		if (cmd === '!volume') {
			if (arg[1]) {
				dispatcher.setVolume(arg[1]);
				message.react('🆗');
			} else {
				message.channel.send('Volume: `'+dispatcher._volume+'`')
			}
		}
		if (cmd === '!time') {
			message.channel.send(dispatcher.time);
		}
		if (cmd === '!stop') {
			dispatcher.end();
			dispatcher = undefined;
			message.react('🆗');
		}
	}

	if (isOp(message.author.id)) {
		if (cmd === '!reloadmusic') {
			message.react('🆗');
			let music_old = music;
			fs.readdir('./music/', function(err,files){music = files;});
			let new_songs = "";
			for(let i=0;i<music.length;i++){
				if(music_old.indexOf(music[i])==-1){ new_songs += music[i]+'\n'; }
			}
			if (new_songs !== "") {
				message.channel.send('The following new songs have been added:\n `'+new_songs+'`')
			}
		}
	}
});
