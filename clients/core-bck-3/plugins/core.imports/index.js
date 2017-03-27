

var React = require('react');
var Baobab = require('baobab');
var Q = require('q');

module.exports = {
    name: 'core.imports',
    extend: {
        imports: {
            React: React,
            Baobab: Baobab,
            Q: Q,
            q: Q
        }
    }
};