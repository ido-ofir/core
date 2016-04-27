
var passport = require('./passport.js');
var userGroup = require('./userGroup.js');
var userPermission = require('./userPermission.js');

module.exports = function(schemas){
  schemas.passport = passport;
  schemas.userGroup = userGroup;
  schemas.userPermission = userPermission;
  return schemas;
};
