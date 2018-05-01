commands.createcard = {
    usage: "<title> <content>",
    description: 'Creates a canned response called a "card" (or whatever you want to call it cause i\'m not sure) which you can call using the `?` prefix. For example, `!createcard foo bar` makes a card titld "foo", so when you say `?foo`, the bot says `bar`.',
    execute: function (message, args, txt) {
        if (!args[1] || cards[args[1]]) return message.react('⚠');
        cards[args[1]] = txt(2);
        fs.writeFile('cards.json', JSON.stringify(cards));
        message.react('🆗');
    }
}