
var Rest = require('./Rest.js');
var RouteAction = require('./RouteAction.js');  // defines an action for each route
var Route = require('./Route.js');              // invokes the action for each route
var express = require('express');

module.exports = function(schemas, orm, config){
    var schema, model, route, action;
    var router = express.Router();
    var api = {
      models: orm.collections,
      routes: {},
      actions: {},
      rest: router
    };

    for(var name in schemas){
      model = orm.collections[name.toLowerCase()];
      if(model) {
        route = new Route(name);
        action = new RouteAction(model);  // 'route' will initiate 'action'
        api.routes[name] = route;
        api.actions[name] = action;
        Rest(name, route, router);
      }
      else console.error('cannot load model ' + name);
    }

    return api;
};
