var request = require('request');

client.on("message", message => {
	if (message.system) return;
    // discord to TaigaChat (experimental)
	if (message.channel.id === config.channels.main && message.member) {
		let msg = `[color=#7289DA][Discord][/color] [color=${message.member.displayHexColor}][b]${message.member.displayName}[/b]: ${message.cleanContent}[/color]`;
		const a = message.attachments.first();
		if (a) msg += a.width ? `\n[img]${a.url}[/img]` : `\n[url=${a.url}]${a.filename}[/url]`;
		request.post(
			{url: `${config.taigachatPostURL}?message=${encodeURIComponent(msg)}&room=1`},
			error => {if (error) console.error(error)}
		);
	}

	// discord to slack
	if (message.channel.id === config.channels.slackBridge && message.member) {
		request.post({
			url: "https://hooks.slack.com/services/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",
			body: {
				text: message.cleanContent,
				username: message.member.displayName,
				icon_url: message.author.avatarURL({format:'png'})
			},
			json: true
		}, error => {if (error) console.error(error)});
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
