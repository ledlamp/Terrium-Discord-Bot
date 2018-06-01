fs.readFile('./notes.json', 'utf8', (err, data) => {
	notes = JSON.parse(data);
});

function newnotec(message,arg,txt){
	if (arg[1]) {
		let exists = false;
		for (var i=0; i<notes.length; i++) {
			if (notes[i].name == arg[1]) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			notes.push({name: arg[1], content: txt(2)});
			fs.writeFile('./notes.json', JSON.stringify(notes));
			message.react('🆗');
		} else {
			message.react('⚠');
		}
	} else {
		message.reply('**Usage:** `!createnote <name> <content...`');
	}
}
