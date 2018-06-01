Array.prototype.random = function () {
	return this[Math.floor(Math.random()*this.length)];
}

function isOp(id) {
	if (ops.includes(id)) {return true;} else {return false;}
}
