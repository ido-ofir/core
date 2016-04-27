// core.loadContext(require.context('dev', true, /.*\.module\.js/));
// core.loadContext(require.context('koko', true, /.*\.module\.js/));
require('../dev/bare')
core.loadContext('koko', require.context('koko', true, /.*\.module\.js/));
core.loadContext('forms', require.context('forms', true, /.*\.module\.js/));
core.loadContext('layout', require.context('layout', true, /.*\.module\.js/));
core.loadContext('ui', require.context('ui', true, /.*\.module\.js/));
core.loadContext('webint', require.context('webint', true, /.*\.module\.js/));
// core.loadContext(require.context('webint/Webint', true, /.*\.module\.js/));
// core.loadContext(require.context('webint/users', true, /.*\.module\.js/));
// core.loadContext(require.context('webint/cases', true, /.*\.module\.js/));
