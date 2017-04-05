# client-core

A modular client side toolchain.

**Documentation and terminology is not complete here, use at your own risk.**

## Installation

```sh
npm install client-core
```

## Usage
```javascript
var core = require('client-core');
```
### Plugins

You can load a plugin by calling the `core.plugin()` method. it expects an object with at least a `name` property:
```javascript
// a very simple plugin is just an object with a name.

core.plugin({
  name: 'dataParser',
  parse(data){ ... }
});

core.plugins.dataParser.parse({});
```

The object that you provide to `core.plugin()` is called a `pluginDefinition` and it must contain a `name` ( which should be unique ).

#### pluginDefinition.init

If you provide a function named `init` on your `pluginDefinition`, it will be called when the plugin is loading, and will be passed the `pluginDefinition` object and a `done` function.

The `done` function should be called when you have finished preparing your plugin. whatever you pass to it will become the plugin's body.

```javascript
core.plugin({
  name: 'test',
  init(pluginDefinition, done){

    done(42);

  }
});

core.plugins.test;  // 42
``` 

#### pluginDefinition.extend

If your `pluginDefinition` contains an object called `extend`, the `extend` object will be merged directly to the core object itself. if `extend` contains functions they will be bound to `core`.

```javascript
core.plugin({
  name: 'extendTest',
  extend: {  // this object will be merged into core.
    value: 42,
    getThis(){ return this; }
  }
});

core.value;  // 42

var { getThis } = core;

getThis() === core;  // true because getThis() has been bound to core.
``` 

#### pluginDefinition.channels

If your `pluginDefinition` contains an array called `channels`, a named channel will be created for each name in the array. ( see more about channels and hooks below. )

```javascript
core.plugin({
  name: 'channelsTest',
  channels: ['channelA', 'channelB']  // just an array of names.
});

core.channels.channelA;  // [] 
core.channels.channelB;  // [] 
```

Channels are just arrays of functions. When you fire up a channel, your data is being passed through the array of functions in async series.

#### pluginDefinition.hooks

If your `pluginDefinition` contains an array called `hooks`, a hook will be tapped into every corresponding channel.
the `hooks` array is expected to contain objects with a `channel` and a `hook` property:

```javascript
core.plugin({
  name: 'hooksTest',
  hooks: [{
    channel: 'channelA',     // the name of the channel to hook to.
    hook(data, next, done){  // a hook function to run when the channel fires.
      data.hook = 'a';
      next();
    },
  }, {
    channel: 'channelB',
    hook(data, next, done){
      data.hook = 'b';
      next();
    }
  }]
});

core.fire('channelA', {}, function(data){
  data.hook;  // 'a'
});

core.fire('channelB', { value: 5 }, function(data){
  data.value;  // 5
  data.hook;  // 'b'
});
```

__Channels and hooks__ can be used by plugins and / or your application logic, to offer extensibility for key features.

The basic operation of `core.plugin()` is using channels to offer extensibility for the way plugins are being loaded. this means that a plugin can add new capabilities to all the plugins that are loaded after it:

```js
core.plugin({
  name: 'pluginDefinitionTest',
  hooks: [{
    // channel 'core.pluginDefinition' fires when a plugin begins to load,
    // before the 'init' function was called.
    channel: 'core.pluginDefinition', 
    hook(pluginDefinition, next){
      
      if(pluginDefinition.test){
        console.log(pluginDefinition.name, '√');
      }
      next();
    }
  }]
});

core.plugin({
  name: 'testing',
  test: true
});
// will log 'testing √'.
```
A plugin can also extend the body of produced plugins:
```js
core.plugin({
  name: 'pluginTest',
  hooks: [{
    // channel 'core.plugin' fires when a plugin has finished loading,
    // after the 'init' function was called.
    channel: 'core.plugin', 
    hook(plugin, pluginDefinition, next){
      
      if(!plugin) return next();
      plugin.test = 5;
      next();
    }
  }]
});

core.plugin({
  name: 'testing'
});

core.plugins.testing.test; // 5
```
Apart from the `pluginDefinition.init` function, all plugin capabilities listed in this page are controlled by plugins loaded to core.

#### pluginDefinition.dependencies

A plugin can depend on another asset (module, component or plugin) in which case it's dependencies should be specified by name in a `dependencies` array:

```js
core.plugin({
  name: 'complexOperations',
  dependencies: ['simpleStuff'],
  init(pluginDefinition, done){

      // this will run second.
      core.plugins.simpleStuff.test; // 5
      done( ... );
  }
});

core.plugin({
  name: 'simpleStuff',
  init(pluginDefinition, done){

      // this will run first.
      done({ test: 5 });
  }
});
```
Note that the call to `init()` on `complexOperations` is delayed until `simpleStuff` has loaded.


#### pluginDefinition.modules

```js
core.plugin({
  name: 'test',
  modules: [{            // an array of module definitions.
    name: 'data',          // the name of the module.
    value: {               // 'value' will become the module's body.
      a: 1,
      b: 2 
    }  
  }, {
    name: 'add',
    get(){  // whatever 'get' returns will become the module's body.
      return function add(a, b){ 
        return a + b; 
      }
    }
  }]
});

var { test } = core.plugins;
var { data, add } = test.modules;

add(data.a, data.b); // 3

core.modules['test.data'] === test.modules.data; // true
```
