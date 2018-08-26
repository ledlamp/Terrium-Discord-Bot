commands.report = {
    usage: "<user> <message...>",
    description: "Reports the user to staff with the given message.",
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('⚠');
        var reporthook = new Discord.WebhookClient('325389793082998794','MwcY9FewIVFWHEQkGK7moClwonD-MMM_I_c_MoL1E82_qnNF-zi4nOR1D5_7I7Jf1c9C');                
        reporthook.send('**Date:** '+Date()+'\n**Submitted by:** '+message.author.username+'\n**Reported user:** '+arg[1]+'\n**Content:** ```\n'+txt(2)+'\n```');
        message.channel.send('Report sent.');
    }
}