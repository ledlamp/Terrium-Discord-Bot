global.userdata = {
    path: "data/user",
    pathTo: function(id){return `${this.path}/${id}.json`},
    create: function(id) {
        fs.writeFileSync(this.pathTo(id), "{}");
        return {};
    },
    load: function(id){
		try {
        	return JSON.parse(fs.readFileSync(this.pathTo(id), 'utf8'));
		} catch(e) {
			return this.create(id);
		}
    },
    save: function(id, doc) {
        doc = JSON.stringify(doc);
        fs.writeFileSync(this.pathTo(id), doc);
    },
    get: function(id, key) {
        var doc = this.load(id);
        return doc[key];
    },
    set: function(id, key, value) { // userdata.set(id, "key", "value") or userdata.set(id, {key:"value"})
        var doc = this.load(id);
        if (typeof key == "object") {
            for (let p in key) doc[p] = key[p];
        } else {
            doc[key] = value;
        }
        this.save(id, doc);
    }
}