commands.title = {
	aliases: ["tit"],
    usage: "[string/user] [string]",
    description: 
		"Sets your title, the name of your personal (color) role.\n" 
	  + "**Examples:** \n`!title Potato Master`\n`!title <@150369687228645386> Tester & QA` (sets others' titles)\n"
	  + "Only Moderators can change others' titles.",
    execute: function (message, args, txt) {
        if (!args[1]) return message.reply(`Your title is **${findColorRole(message.member).name.slice(1,-1)}**.`);
        
        function changeTitle(message, member, titleInput) {
            const titleRole = findColorRole(member);
            if (!titleRole) return message.react('⚠');
            titleRole.setName('['+titleInput+']').then(() => message.react('🆗'), () => message.react('⚠'));
        }


        //const selectedMember = (args[1].startsWith('<@') && args[1].endsWith('>') && args[1].length === 21) ? myguild.members.get(args[1].substr(2,18)) : undefined;
        const selectedMember = message.mentions.members.first();
		if (selectedMember) {
            if (args[2]) {
                if (hasPermission(message.member, 2)) changeTitle(message, selectedMember, txt(2) === 'none' ? '' : txt(2));
                else message.react('🚫');
            } else {
                message.reply(`**${selectedMember.displayName}**'s title is **${findColorRole(selectedMember).name.slice(1,-1)}**.`);
            }
        } else changeTitle(message, message.member, txt(1) === 'none' ? '' : txt(1));
       
    }
}