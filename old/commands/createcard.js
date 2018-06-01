commands.createcard = {
    usage: "<title> <content>",
    description: "Creates a \"card\" command, for example `?foo`",
    execute: function (message, args, txt) {
        if (!args[1] || cards[args[1]]) return message.react('⚠');
        cards[args[1]] = txt(2);
        fs.writeFile('cards.json', JSON.stringify(cards));
        message.react('🆗');
    }
}