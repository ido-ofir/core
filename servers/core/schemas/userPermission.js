/*
  associate a user with a set of permissions. each permission in the permissions array is a name of a permission that exists in the master config
  we keep user permissions seperate from the actual users to allow free access to the users collection without exposing permission settings.
*/
var userPermission = {
  attributes: {
    userId: { type: 'string',  unique: true},    // only one userPermission per user.
    permissions: { type: 'array' }              // array of permissions assigned for this user. permissions are identified by name and defined in the master config.
  }
};

module.exports = userPermission;
