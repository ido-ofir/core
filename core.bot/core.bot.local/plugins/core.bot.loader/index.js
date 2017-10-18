
var readline = require('readline');

function characters(character, length, factor){
    var str = '';
    for(var i = 0; i < length / (factor || 0); i++){
        str += character;
    }
    return str;
}

function loadingBar(precent){
    return `\u001B[42m${ characters(' ', precent, 4) }\u001B[0m${characters(' ', 100 - precent, 4)}`;;
}



function loader(cb){
    process.stdout.write(`0 %`);
    return {
        at(precent, msg){
            readline.cursorTo(process.stdout, 0);
            msg = msg ? (` > ${ msg }`) : '';
            process.stdout.write(`${ parseInt(precent) } % ${loadingBar(precent)} ${ msg }`);
            if(precent >= 100){ cb && cb(this); }
        },
        clear(){
            readline.cursorTo(process.stdout, 0);
            readline.clearScreenDown();
        }
    };    
}

function dummy(cb){
    var index = 0;
    var loading = loader(cb);
    function dummy() {
        if(index < 100){
            index = index + 1;
            loading.at(index);
            setTimeout(dummy, 10);
        }
    }
    dummy();
}

loader.dummy = dummy;

module.exports = {
    name: 'core.bot.loader',
    init(def, done){

        this.extend({
            loader: loader
        });
        
        done();
    }
}


// function dummyLoader(cb){
//     console.log('');
//     loader.dummy(function(){
//         console.log('');
//         console.log('');
//         console.log(' everything is ok.')
//         console.log('');
//         cb();
//     })
// }