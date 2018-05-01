module.exports = {


    init: function(client){

        // discord to slack
        client.on("message", message => {
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

        var slackhook = new Discord.WebhookClient("370784120759910402", "xPSRgJxxWvOeoESmYrJfSxAOKQYICiBiyvlpRS2tUN-xJSVkH8rgX9YmtMiu4gGy-RhI");
	
        var express = require('express');
        var bodyParser = require('body-parser');
        var app = express();

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

    }
}