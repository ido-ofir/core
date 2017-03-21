function parse(data){
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}
function stringify(data){
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  parse: parse,
  stringify: stringify
};
