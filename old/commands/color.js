commands.color = {
    usage: "[ColorResolvable/member] [ColorResolvable]",
    description: `Changes your color, the color of your personal role.
\`!color\` tells you your color. \`!color red\` makes you red. \`!color <@281134216115257344>\` tells the color of the selected person. Moderators can change others' color like so: \`!color <@281134216115257344> red\`
To find out what you may input as a color, go to https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable`,
    execute: function (message, args, txt) {

        function changeColor(message, member, colorInput) {
            const colorRole = findColorRole(member);
            if (!colorRole) return message.react('⚠');
            colorRole.setColor(colorInput.toUpperCase()).then(() => message.react('🆗'), () => message.react('⚠'));
        }

        function getColor(member) {
            return new Color(member.displayHexColor).getName().replace('A shade', 'a shade');
        }

        if (args[1]) {
            const selectedMember = (args[1].startsWith('<@') && args[1].endsWith('>') && args[1].length === 21) ? myguild.members.get(args[1].substr(2,18)) : undefined;
            if (selectedMember) {
                if (args[2]) {
                    if (hasPermission(message.member, 2)) changeColor(message, selectedMember, txt(2));
                    else message.react('🚫');
                } else message.reply(`**${selectedMember.displayName}**'s color is **${getColor(selectedMember)}**.`);
            } else changeColor(message, message.member, txt(1));
        } else message.reply(`Your color is **${getColor(message.member)}**.`);
    
    }
}