commands.mute = {
    usage: "<userTag> [duration] [reason]",
    restrictedTo: 2,
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('❓');
        const victim = message.mentions.members.first();
        if (!victim) return message.react('⚠');
        message.delete();
        const duration = +args[2];
        const reason = txt(duration ? 3 : 2);
        victim.removeRole(myguild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
        victim.addRole(myguild.roles.get(config.roles.muted));
        if (duration) {
            setTimeout(()=>{
                victim.removeRole(myguild.roles.get(config.roles.muted));
                victim.addRole(myguild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
            }, duration*60*1000);
        }
        message.channel.send(`🔇 **${message.member} muted ${victim}${duration ? ` for ${duration} minute${duration == 1 ? '' : 's'}.` : "."} ${reason ? `Reason: \`${reason}\`` : ""}**`);
    }
}
commands.unmute = {
    arguments: "<userTag>",
    hidden: true,
    restrictedTo: 2,
    execute: function (message, args, txt) {
        if (!args[1]) return message.react('❓');
        const victim = message.mentions.members.first();
        if (!victim) return message.react('⚠');
        message.delete();
        victim.removeRole(myguild.roles.get(config.roles.muted));
        victim.addRole(myguild.roles.get(config.roles[victim.user.bot?'robots':'humans']));
        message.channel.send(`🔈 **${message.member} unmuted ${victim}.**`);
    }
}