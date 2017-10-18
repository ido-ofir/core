
var fs = require('fs');
var path = require('path');

var loader, unread = 0;
var count = 0;

var mkdir = function(dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 0755);
	} catch(e) {
		if(e.code !== "EEXIST") {
			throw e;
		}
	}
};

var rmdir = function(dir) {
	if (fs.existsSync(dir)) {
		var list = fs.readdirSync(dir);
		for(var i = 0; i < list.length; i++) {
			var filename = path.join(dir, list[i]);
			var stat = fs.statSync(filename);
			
			if(filename == "." || filename == "..") {
				// pass these files
			} else if(stat.isDirectory()) {
				rmdir(filename);
			} else {
				fs.unlinkSync(filename);
			}
		}
		fs.rmdirSync(dir);
	}
};

function read(fPath){

    var result, stats = fs.statSync(fPath);
    if(stats.isDirectory()){
        result = {};
        var files = fs.readdirSync(fPath);
        files.map(function(file){
            result[file] = read(path.join(fPath, file))
        });
    }
    else{
        result = fs.readFileSync(fPath, 'utf8');
    }
    return result;
}

function write(fPath, data){

    if(typeof data === 'string'){
        fs.writeFileSync(fPath, data);
    }
    if(typeof data !== 'object') return;
    for(var m in data){
        mkdir(fPath);
        write(path.join(fPath, m), data[m]);
    }
}


module.exports = {
    name: 'core.bot.folder',
    init(def, done){

        this.extend({
            read: read,
            write: write,
            copy(from, to){
                write(to, read(from));
            }
        });
        
        done();
    }
}; 