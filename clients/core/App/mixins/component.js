
var React = require('react');
var path = require('path');

// var appsRoot = path.resolve(__dirname, '../../../apps');
// require.context(appsRoot, true, /\.koko\.jsx$/);

var components = {};
var delayed = [];

function testAndRun() {

    var classDefinition,
        dependency,
        dependencies,
        hasAllDependencies;

    var lastLength = delayed.length;

    delayed = delayed.filter(function(item){
        dependencies = [],
        hasAllDependencies = true;
        for(let i = 0; i < item.dependencies.length; i++){
            dependency = item.dependencies[i];
            if(dependency){
                if(!components[dependency]) {
                    hasAllDependencies = false;
                    break;
                }
                else{
                    dependencies.push(components[dependency]);
                }
            }

        }
        if(hasAllDependencies){
            console.log('running', item.name);
            classDefinition = item.method.apply(null, dependencies);
            if(!classDefinition) return console.error(`component ${item.name} has not returned a react class definition`);
            components[item.name] = React.createClass(classDefinition);
            return false;
        }
        return true;
    });

    if(lastLength !== delayed.length) testAndRun();
}


module.exports = {
    load (dir) {
        //var paths = require.context(dir, true, /\.jsx$/);
        //for(var path in paths){
        //    require(path);
        //}
    },
    define (name, method) {
        if(components[name]) return console.error(`component ${name} was declared multiple times..`);
        var methodString = method.toString();
        var dependencies = methodString.substring(methodString.indexOf('(')+1, methodString.indexOf(')'));
        dependencies = dependencies.split(',');
        dependencies.map(function(item){ return item.trim(); });
        delayed.push({
            name: name,
            dependencies: dependencies,
            method: method
        });
        testAndRun();
    },
    require (name) {
        return components[name];
    }
};
