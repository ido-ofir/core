
var assign = require('./assign.js');
var Emitter = require('./Emitter.js');
var Promise = require('./Promise.js');
var Transform = require('./Transform.js');
var debounce = require('./debounce.js');
var uuid = require('./uuid.js');
// var animation = require('./animation.js');
var immutableMerge = require('./immutableMerge.js');
var stringify = require('./stringify.js');
var parse = require('./parse.js');
var parseSchema = require('./parseSchema.js');
var validateSchema = require('./validateSchema.js');
var getPropTypes = require('./getPropTypes.js');
var find = require('./find.js');
var set = require('./set.js');
var merge = require('./merge.js');
var unset = require('./unset.js');
var except = require('./except.js');
var equals = require('./equals.js');
var ArrayFind = require('./ArrayFind.js');
var inherit = require('./inherit.js');

module.exports = {
  Emitter: Emitter,
  Promise: Promise,
  Transform: Transform,
  ArrayFind: ArrayFind,
  debounce: debounce,
  uuid: uuid,
  // animation: animation,
  immutableMerge: immutableMerge,
  stringify: stringify,
  parse: parse,
  parseSchema: parseSchema,
  validateSchema: validateSchema,
  getPropTypes: getPropTypes,
  find: find,
  set: set,
  unset: unset,
  merge: merge,
  except: except,
  equals: equals,
  inherit: inherit
};
