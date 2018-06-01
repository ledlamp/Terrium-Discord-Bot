commands.randplex = {
    description: "Gets a link to a random Plexpedia post",
    execute: function (message, args, txt) {
        message.channel.send("http://plexpedia.com/view-" + (Math.floor(Math.random()*15000)+106) );
    }
}