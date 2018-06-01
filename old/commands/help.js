commands.help = {
    aliases: ["robot", "commands"],
    description: "Gets command list",
    execute: function (message, args, txt) {
        /*message.react('📨');message.react('👌');
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
        */

        /*const embed = {
            author: {name: 'Terrium Bot Commands', icon_url: client.user.avatarURL},
            color: message.guild.me.colorRole.color,
            fields: []
        }

        for (const commandName in commands) {
            const command = commands[commandName];
            if (command.hidden) continue;
            const field = {
                name: `!${commandName} ${command.arguments || ""}`,
                value: command.description || "\u2063",
                inline: true
            }
            embed.fields.push(field);
        }

        //message[args[1] === "--here" ? "channel" : "author"].send({embed});
        message.channel.send({embed});*/

        if (args[1]) {
            const commandName = args[1];
            const command = commands[commandName];
            if (!command) return message.react('❓');
            const str = '`!' + (commandName + ' ' + (command.usage || '')).trim() +'`\n\n' + (command.description || '(no description)');
            message.channel.send(str);
        } else {

            /*const embed = {
                author: {name: 'About Terrium Bot', icon_url: client.user.avatarURL},
                color: message.guild.me.colorRole.color,
                description: `The Terrium Discord Bot is the official bot of the Terrium Community Discord Server.
Below are the available commands. Use \`!help <command>\` for more information on a command, for example, \`!help color\`.
Commands can be used in a direct message.`,
                fields: []
            }
            const commandArray = [];
            const modCommandArray = [];
            for (const commandName in commands) {
                const command = commands[commandName];
                if (command.hidden) continue;
                if (!command.hasOwnProperty('restrictedTo')) commandArray.push(`!${commandName}`);
                else if (command.restrictedTo >= 2) modCommandArray.push(`!${commandName}`);
            }
            if (commandArray) embed.fields.push({name: "General Commands", value: commandArray.join(', ')});
            //if (modCommandArray && hasPermission(message.member, 2)) embed.fields.push({name: "Moderator Commands", value: modCommandArray.join(', ')});
            message.channel.send({embed});*/

            let str =
            "**About Terrium Bot**\n" +
            "The Terrium Discord Bot is the official bot of the Terrium Community Discord Server.\n" +
            "Below are the available commands. Use `!help <command>` for more information on a command, for example, `!help color`.\n" +
            "Commands can be used in a direct message.";

            const commandArray = [];
            const modCommandArray = [];
            for (const commandName in commands) {
                const command = commands[commandName];
                if (command.hidden) continue;
                if (!command.hasOwnProperty('restrictedTo')) commandArray.push(`!${commandName}`);
                else if (command.restrictedTo >= 2) modCommandArray.push(`!${commandName}`);
            }

            if (commandArray.length > 0) str += `\n\n**General Commands**\n${commandArray.join(', ')}`
            if (hasPermission(message.member, 2) && modCommandArray.length > 0) str += `\n\n**Moderator Commands**\n${modCommandArray.join(', ')}`

            message.channel.send(str);
        }
    }
}