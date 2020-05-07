
Array.prototype.random = function () {
	return this[Math.floor(Math.random()*this.length)];
} // if problems try get below to work

/*Object.defineProperty(Array.prototype, 'random', {
    value: function(array) {array[Math.floor(Math.random()*array.length)];}
});*/

function chunkSubstr(str, size) {
  var numChunks = Math.ceil(str.length / size),
      chunks = new Array(numChunks);
  for(var i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }
  return chunks;
}

global.supersend = function supersend(input, channel) {
	if (input.length > 2000) {
		let chunks = chunkSubstr(input, 2000);
		chunks.forEach(function(chunk) {
			channel.send(chunk);
		});
	} else {
		channel.send(input);
	}
}

global.getRandomArbitrary = function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

global.getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

global.findColorRole = function findColorRole(member) {
	return member.roles.cache.find(role => {if (role.name.startsWith('[') && role.name.endsWith(']')) return role});
}

global.hasPermission = function hasPermission(member, value) {
	return (
		(member.user.id === config.op && value >= 0) ||
		(member.roles.cache.has(config.roles.admin) && value >= 1) ||
		(member.roles.cache.has(config.roles.mod) && value >= 2)
	)
}