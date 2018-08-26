global.botClients = [];

commands.bots = {
    restrictedTo: 1,
    execute: function (message, args, txt) {
        const botTokens = config.botTokens;


        /*if (args[1] == 'spawn') {
            const spawnBot = function (token, id) {
                var client = new Discord.Client();
                client.login(token);
                var connection, dispatcher;
                client.on('message', message => {
                    setTimeout(function (){
                        var arg = message.content.split(' ');
                        var cmd = arg[0].slice(1).toLowerCase();
                        var txt = function(i){return arg.slice(i).join(' ');};

                        if (message.guild && message.author.id === op && cmd == 'bots') {
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
            function spawnBot(token, id) {
            	const client = new Discord.Client();
            	client.login(token);
            	botClients[id] = client;
            }
            if (args[2] === 'all') {
                botTokens.forEach(spawnBot);
                message.react('🆗');
            } else if (args[2]) {
                if (args[2] > botTokens.length) return message.react('⚠');
                let i;
                for (i = 0; i < args[2]; i++) {
                    spawnBot(botTokens[i], i);
                }
                message.react('🆗');
            } else {
                message.react('⚠');
            }
      }*/

        const q = args[1] === "all" ? botTokens.length : args[1];
        if (q > botTokens.length) return message.react('⚠');
        let i;
        for (i = 0; i < q; i++) {
            if (args[2] === "spawn") {
                (async function(){
                    const client = new Discord.Client();
                    await client.login(botTokens[i]);
                    botClients.push(client);
                    (await client.channels.get(message.channel.id).messages.fetch(message.id)).react('🆗');
                })();
            }
            (function(){
                const client = botClients[i];
                if (!client) return;
                
                if (args[2] === "ping") {
                    client.channels.get(message.channel.id).send('pong');
                }
                if (args[2] === "join") {
                    client.channels.get(message.member.voiceChannel.id).join();
                }
                if (args[2] === "play") {
                    client.channels.get(message.member.voiceChannel.id).join().then(connection => {
                        connection.playFile(txt(3));
                    });
                }
                if (args[2] === "eval") {
                    try {var evaluation = eval(txt(3).replace(/%id/g, i))}
                    catch(e) {var evaluation = e}
                    client.channels.get(message.channel.id).send('`'+evaluation+'`');
                }
                if (args[2] === "destroy") {
                    client.destroy();
                }
            })();
        }
    }
}