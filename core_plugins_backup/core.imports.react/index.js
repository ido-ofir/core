

var react = require('react');
var reactCreateClass = require('create-react-class');
react.createClass = reactCreateClass;
module.exports = {
    name: 'core.imports.react',
    imports: {
        react: react,
        React: react
    }
};