/**
 * @namespace Loko
 * @constructor 
 * @param {object} options - instance options.
 * @param {string} options.name - a unique name for the instance.
 * @param {array} options.plugins - an array on plugins to initialize on the instance.
 * @param {object} options.extend - if provided, this object will be merged in to the new instance.
 * @example
 * var core = new Core({
 *     name: 'client-core',
 *     plugins: [
 *         require('./pluginA'),
 *         require('./pluginB')
 *     ]
 * });
 */

function Loko(){}