global.roleManager = {
    permissions: require('./permissions.json'),


    createColorRole: async function(member){
        var role = await member.guild.roles.create({
            data: {
                name: '[]',
                color: 'RANDOM',
                permissions: [],
                position: member.guild.roles.get(config.roles.colorHeader).position
            }
        });
		await member.roles.add(role);
		return role;
    },

    getColorRole: function(member){
        return member.roles.find(role => {
            if (role.name.startsWith('[')) return role;
        });
    },

	purgeColorRole: async function(member){
		var role = await this.getColorRole(member);
		if (role && role.members.array().length == 0) role.delete();
	},
	
	pruneColorRoles: function() {
		return Promise.all(client.guilds.get(config.guild).roles.filter(r => r.name.startsWith('[')).map(r => r.delete()));
	},
	
	addMissingColorRoles: async function() {
		for (let [id, member] of client.guilds.get(config.guild).members.filter(m => this.getColorRole(m))) {
			await this.createColorRole(member);
		}
	},

    applyPermissions: function(member, permissions){
        var role = this.getColorRole(member);
        return role.setPermissions(permissions);
    },

    clearPermissions: function(member){
        var role = this.getColorRole(member);
        return role.setPermissions([]);
    },

    entrust: async function (member){ // 🤔
        return this.applyPermissions(member, this.permissions.trusted);
    },


}

/*commands.entrust = {
    //todo
}*/





client.on('guildMemberAdd', member => {
	if (member.guild.id !== config.guild) return;
	
	// returning member
	var backup = userdata.get(member.id, "backup");
	if (backup) {
		if (backup.roles) {
			for (let role of backup.roles) {
				let existingRole = member.guild.roles.get(role.id);
				if (existingRole) {
					member.addRole(existingRole);
				} else {
					if (!role.name.startsWith('[')) continue; // 🤔
					member.guild.createRole({data:{
						name: role.name,
						color: role.color,
						permissions: role.permissions,
						position: role.position
					}}).then(role => member.addRole(role));
				}
			}
		}
		if (backup.nickname) member.setNickname(backup.nickname);
	} else {
		// new member
		roleManager.createColorRole(member);
		if (member.user.bot) {
			member.roles.add(member.guild.roles.get(config.roles.robots));
		} else {
			member.roles.add(member.guild.roles.get(config.roles.humans));
		}
	}
});



client.on('guildMemberRemove', member => {
	if (member.guild.id !== config.guild) return;

	var backup = {
		roles: [],
		nickname: member.nickname
	}
	for (let role of member.roles.array()) {
		if (role.id == member.guild.defaultRole.id) return;
		backup.roles.push({
			id: role.id,
			name: role.name,
			color: role.color,
			position: role.position,
			permissions: role.permissions
		});
	}
	userdata.set(member.id, {backup});
	roleManager.purgeColorRole(member);
});






commands.color = {
	aliases: ["col"],
    usage: "[member] <color>",
    description: 
`Changes your color, the color of your personal role. You may input a hex color code or HTML color name. Invalid colors will make you colorless.
Examples:
\`!color\` tells you your color.
\`!color red\` makes you red.
\`!color <@281134216115257344>\` tells the color of the selected person.
Moderators can change others' color like so: \`!color <@281134216115257344> red\``,
    execute: function (message, args, txt) {

        function changeColor(message, member, colorInput) {
            const colorRole = findColorRole(member);
            if (!colorRole) return message.react('⚠');
			colorInput = require('convert-css-color-name-to-hex')(colorInput);
            colorRole.setColor(colorInput.toUpperCase()).then(() => message.react('🆗'), () => message.react('⚠'));
        }

        function getColor(member) {
            return new (require('./lib/Color.js'))(member.displayHexColor).getName().replace('A shade', 'a shade');
        }

        if (args[1]) {
            //const selectedMember = (args[1].startsWith('<@') && args[1].endsWith('>') && args[1].length === 21) ? myguild.members.get(args[1].substr(2,18)) : undefined;
            const selectedMember = message.mentions.members.first();
			if (selectedMember) {
                if (args[2]) {
                    if (message.member.hasPermission("MANAGE_ROLES")) changeColor(message, selectedMember, txt(2));
                    else message.react('🚫');
                } else message.reply(`**${selectedMember.displayName}**'s color is **${getColor(selectedMember)}**.`);
            } else changeColor(message, message.member, txt(1));
        } else message.reply(`Your color is **${getColor(message.member)}**.`);
    
    }
};





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
                if (message.member.hasPermission("MANAGE_ROLES")) changeTitle(message, selectedMember, txt(2) === 'none' ? '' : txt(2));
                else message.react('🚫');
            } else {
                message.reply(`**${selectedMember.displayName}**'s title is **${findColorRole(selectedMember).name.slice(1,-1)}**.`);
            }
        } else changeTitle(message, message.member, txt(1) === 'none' ? '' : txt(1));
       
    }
};
