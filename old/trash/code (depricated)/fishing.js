var fishhook = new Discord.WebhookClient('334079721119809537','MHsR9-PNrbEgzHv99e2Tv9hNJjfEQ_Q9EaZvZXpz8A1JW9a0-nyEuC3yVzaWHO9uN0qE');

fs.readFile('./fishing/fish.txt', 'utf8', (err,data) => {
	if (err) throw err;
	fish = data.split('\n');
});

var newfish = ["Anchovy","Basa","Bass","Striped Bass","Black cod","Blowfish","Bluefish","Bombay duck","Bream","Brill","Butter fish","Catfish","Cod","Pacific cod","Atlantic cod","Dogfish","Dorade","Eel","Flounder","Grouper","Haddock","Hake","Halibut","Herring","Ilish","John Dory","Kingfish","Lamprey","Lingcod","Mackerel","Mahi Mahi","Monkfish","Mullet","Orange roughy","Parrott fish","Patagonian toothfish","Pike","Pilchard","Pollock","Pomfret","Pompano","Sablefish","Salmon","Sanddab","Sardine","Sea bass","Shad","Alewife","American shad","Shark","Skate","Smelt","Snakehead","Snapper","Rockfish","Rock cod","Pacific snapper","Sole","Sprat","Sturgeon","Surimi","Swordfish","Tilapia","Tilefish","Trout","Rainbow trout","Tuna","Albacore tuna","Yellowfin tuna","Bigeye tuna","Bluefin tuna","Turbot","Wahoo","Whitefish","Whiting"];

var currently_fishing = [];
function fishc(message, arg, txt) {
	if (!currently_fishing.includes(message.author.id)) {
		fishhook.send('**'+message.member.displayName+'** casts LURE into water for catching fish.');
		setTimeout(function(){
			var caught_fish = fish.random();
			fishhook.send('**'+message.member.displayName+'** caught a **'+caught_fish+'**.');
			var path = './fishing/sacks/'+message.author.id+'.json';
			if (fs.existsSync(path)) {
				fs.readFile(path, 'utf8', (err, data)=>{
					let sack = JSON.parse(data);
					sack.push(caught_fish);
					fs.writeFile(path, JSON.stringify(sack));
				});
			} else {
				fs.writeFile(path, '["'+caught_fish+'"]');
			}
			currently_fishing.splice(currently_fishing.indexOf(message.author.id), 1);
		}, getRandomArbitrary(60000, 900000)); // 1-15 min
//		}, getRandomArbitrary(0, 1000)); // debug
		currently_fishing.push(message.author.id);
	} else {
		fishhook.send('You are already fishing')
	}
}
/* old
var currently_fishing = [];
function fishc(message, arg, txt) {
	if (!currently_fishing.includes(message.author.id)) {
		message.channel.send('**'+message.member.displayName+'** casts LURE into water for catching fish.');
		setTimeout(function(){
			var caught_fish = fish.random();
			message.channel.send('**'+message.member.displayName+'** caught a **'+caught_fish+'**.');
			fs.appendFile('./fishing/sacks/'+message.author.id+'.txt', caught_fish+'\n');
			currently_fishing.splice(currently_fishing.indexOf(message.author.id), 1);
		}, getRandomArbitrary(60000, 900000)); // 1-15 min
//		}, getRandomArbitrary(5000, 10000)); // debug
		currently_fishing.push(message.author.id);
	} else {
		message.reply('You are already fishing')
	}
}
*/

function sackc(message, arg, txt) {
	fs.readFile('./fishing/sacks/'+message.author.id+'.json', 'utf8', (err, data)=>{
		if (typeof data === 'undefined'|| data === "[]") {fishhook.send('Your sack is empty.'); return;}
		var sacklist = JSON.parse(data).join(', ');
		if (sacklist.length > 1950) {
			fishhook.send('Your sack is too large to fit in the chat!');
		} else {
			fishhook.send('Contents of '+message.member.displayName+'\'s sack: ```\n' + sacklist + '```');
		}
	});
}

/* old
function sackc(message, arg, txt) {
	fs.readFile('./fishing/sacks/'+message.author.id+'.txt', (err, data)=>{
		if (typeof data === 'undefined'|| data == "") {message.reply('Your sack is empty.'); return;}
		var array = data.toString().split('\n');
		array.pop();
		var list = array.join(', ');
		message.channel.send('Contents of '+message.member.displayName+'\'s sack: ```\n' + list + '```');
	});
}
*/

var fish_tastes = [
// It tasted...
	'fishy',
	'delicious',
	'horrible',
	'like Vloxor',
	'tangy',
	'sweet',
	'like something you wouldn\'t want to eat',
	'like chicken',
	'epic',
	'wonderful',
	'like rainbows and sunshine',
	'like candy',
	'terrific',
	'sour',
	'spicy',
	'salty',
	'orange',
	'like a fish',
	'like nothing',
	'unknown',
	'like shit',
	'peppery',
	'incredible',
	'meh',
	'bland',
	'raw',
	'like cheese',
	'awesome',
	'ok',
	'fine'
];
function eatc(message, arg, txt) {
	fs.readFile('./fishing/sacks/'+message.author.id+'.json', 'utf8', (err, data)=>{
		if (typeof data === 'undefined' || data === "[]") {fishhook.send('You do not have anything to eat.'); return;}
		var sack = JSON.parse(data);
		var sackTLC = [];
		sack.forEach(item=>{sackTLC.push(item.toLowerCase());});
		if (arg[1] != "" && sackTLC.includes(txt(1).toLowerCase())) {
			var eatfish = sack.splice(sackTLC.indexOf(txt(1).toLowerCase()), 1);
		} else {
			var eatfish = sack.splice(getRandomInt(0,sack.length-1), 1);
		}
		fs.writeFile('./fishing/sacks/'+message.author.id+'.json', JSON.stringify(sack));
		if ([false,false,false,true].random()) {
			message.member.colorRole.setColor('RANDOM').then(()=>{
//				let colorname = color_namer(message.member.colorRole.hexColor, { pick: ['ntc'] }).ntc[0].name;
				fishhook.send('**'+message.member.displayName+'** ate a **'+eatfish+'** and their color changed to '+message.member.colorRole.hexColor+'!!');
			});
		} else {
			fishhook.send('**'+message.member.displayName+'** ate a **'+eatfish+'**. It tasted '+fish_tastes.random()+'.');
		}
	});
}

/* old
function eatc(message, arg, txt) {
	fs.readFile('./fishing/sacks/'+message.author.id+'.txt', (err, data)=>{
		if (typeof data === 'undefined' || data == "") {message.reply('You do not have anything to eat.'); return;}
		var opensack = data.toString().split('\n');
		opensack.pop();
		var opensackTLC = [];
		opensack.forEach(item=>{opensackTLC.push(item.toLowerCase());});
		if (arg[1] != "" || opensackTLC.includes(txt(1).toLowerCase())) {
			var eatfish = opensack.splice(opensackTLC.indexOf(txt(1).toLowerCase()), 1);
		} else {
			var eatfish = opensack.splice(getRandomInt(0,opensack.length), 1);
		}
		opensack.push("");
		fs.writeFile('./fishing/sacks/'+message.author.id+'.txt', opensack.join('\n'));
		if ([false,false,false,true].random()) {
			message.member.colorRole.setColor('RANDOM').then(()=>{
//				let colorname = color_namer(message.member.colorRole.hexColor, { pick: ['ntc'] }).ntc[0].name;
				message.channel.send('**'+message.member.displayName+'** ate a **'+eatfish+'** and their color changed to '+message.member.colorRole.hexColor+'!!');
			});
		} else {
			message.channel.send('**'+message.member.displayName+'** ate a **'+eatfish+'**. It tasted '+fish_tastes.random()+'.');
		}
	});
}
*/
