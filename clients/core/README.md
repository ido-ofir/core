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

#### pluginDefinition.

