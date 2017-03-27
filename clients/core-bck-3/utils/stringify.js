
module.exports = function stringify(data, b, c){
  var str = '';
  try {
    str = JSON.stringify(data, b, c);
  } catch (e) {
    console.error(e);
  } finally {
    return str;
  }
};
