
var cache = {};

module.exports = {
    set(key, value){
        cache[key] = value;
    },
    get(key){
        return cache[key];
    },
    delete(key){
        return (delete cache[key]);
    }
};