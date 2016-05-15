require('../dev')
core.loadContext('koko', require.context('koko', true, /.*\.module\.js/));
core.loadContext('forms', require.context('forms', true, /.*\.module\.js/));
core.loadContext('layout', require.context('layout', true, /.*\.module\.js/));
core.loadContext('ui', require.context('ui', true, /.*\.module\.js/));
core.loadContext('mongo', require.context('mongo', true, /.*\.module\.js/));
