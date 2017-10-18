
module.exports = {
    name: 'core.prepend',
    extend: {
        prepend(prefix, text){
            if(text.indexOf(`${ prefix }.` !== 0)){
                return `${ prefix }.${ text }`;
            }
            return text;
        }
    }
};