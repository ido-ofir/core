# core

An un-opinionated framework for react and node applications.

* [Installation](#installation)
* [Startup](#startup)
* [Modules and components](#modules-and-components)
  - [Defining core modules](#defining-core-modules)
  - [Requiring modules](#requiring-modules)
  - [Defining core components](#defining-core-components)
* [Application state](#application-state)
  - [Accessing the state tree](#accessing-the-state-tree)
  - [Bindings](#bindings)
  - [Binding components](#binding-components)
* [Routing](#routing)
  - [Rendering](#rendering)
  - [Query and route](#query-and-route)

## Installation

This repo is meant to be cloned as the basis for a webapp or a group of webapps.

so just clone the repo and rename it, or copy the files to your own repo.

make sure <a href="https://nodejs.org/en/" target="_blank">node</a> is installed on your machine.

step into the root of the repo and install dependencies:

```
npm install
```

make sure webpack is installed globally:

```
npm install -g webpack
```

## Startup

Start the default server by running this command from the root of this repo:

```
node run
```

the server should serve all the apps at 'clients/apps/' through port 4000.

go to some app's folder and run webpack:

```
cd clients/apps/app
webpack -w
```

## Modules and components

### Defining core modules
The core contains a module dependency management system that runs on the client.

a module can be anything and the only requirement is that you give it a unique name.

a module with no dependencies can be defined like this:
```js
var core = require('core');

// defining a module called 'utils' as an object

core.Module('utils', { ... });

```
A module can require other modules using their unique names.

for example this defines a module called 'engine' that requires the module 'utils':
```js
var core = require('core');

core.Module('engine', ['utils'], (utils) => {
  
  // do something with 'utils'.
  
  return {    // return the 'engine' module.
    ...
  }
});

```

##### Note that the callback will get the modules in the order that you've required them in the array.

### Requiring modules
If you only need to get some modules without defining a new one, use the `require` function: 
```js
core.require([
  'engine',
  'utils'
  ], (engine, utils) => {
  
  ...
  
});
```

### Defining core components

Components can be defined similar to normal modules, using a unique name.

very simple components can be represented by a function:
```jsx
var core = require('core');

core.Component('Cell', props => <div>{ props.text }</div>);

```
more complext components can be defined using an object:
```jsx
var core = require('core');

core.Component('Cell', {
  render(){
  
    return (
      <div>{ props.text }</div>
    );
    
  }
});
```
or using an array and a callback to get dependecies:
```jsx
var core = require('core');

core.Component('Table', ['Cell'], (Cell)=>{

  return {
    render(){
    
      return (
        <div>
          <Cell text="one"/>
          <Cell text="two"/>
          <Cell text="three"/>
        </div>
      );
      
    }
  };
  
});
```
the object that you pass to `core.Component` ( or return from the callback ) is the same object that you would have passed to `React.createClass`. there are a few enhancments that you can use when creating components with `core.Component`. see below for more details.

## Application state

The core handles the application's state using a <a href="https://github.com/Yomguithereal/baobab" target="_blank">Baobab</a> tree. a Baobab tree is a persistent and immutable data structure. immutabilty is helpful with optimizations and persistency adds an undo/redo capability to your app.

### Accessing the state tree
The core instantiates a single tree to handle all of the app's state. it is accessible as `core.tree`. 
```js
var data = core.tree.get();
```
if you look at `data` you will notice that there is a `core` object on it. this is where the core keeps all the data that it manages internally, such as forms and routing state. the rest of the tree is initially empty and you can put whatever you like on it. 
##### because Baobab is immutable, `data` is <b>your app's state at a specific point in time</b>.

### Bindings
apart from the api of the tree itself, the core provides some methods for creating bindings to this state.

for the simplest binding, use the `core.watch` method:

```js
core.watch(['a', 'b'], value => console.log('changed to ', value));

core.tree.set(['a', 'b'], 5);
// changed to 5
```

### Binding components
binding a component's state to the tree can be done by adding a `bindings` object to your component definition:
```jsx

core.tree.set('count', 1);

core.Component('Counter', {
  bindings: {
    count: ['count']
  },
  render(){
  
    return (
      <div>
        { this.state.count }
      </div>
    );
    
  }
});
```
this will cause the `Counter` component to update `count` on it's state whenever `count` changes on the tree.

however in some cases it could be more convenient to make this binding 'on the fly'. the `core.bind` method creates a place inside your rendered react tree that is bound to a part of the app's state:

```jsx
core.Component('Counter', props => 
  <div>
    { core.bind('count', count => <div>{ count }</div>) }
  </div>
);
```
now, changing the `count` will cause the count to update on screen, but the `Counter` component did not need to re-render itself. the binding will run the function you've passed to `core.bind` on every update and use the returned value to update the ui.

### Modifying state

updating the state of your app should be done in a place that is detached from the UI, but allows operations to be triggered easily by any component. the core provides a simple platform to do this, called actions.

#### Defining Actions

actions are basically functions that get an object of parameters and a promise. to define an action call `core.Action` passing a name for the action and a function.
```js
core.Action('test', (data, promise)=>{
  
  core.tree.set('test', '√');
  
});
```
#### Executing actions

to execute an action, call `core.run` passing the name of the action and an object of parameters.

```
core.run('test', {});
```


a schema object can be defined with the action to make sure it gets the right parameters:

```js
core.Action('test', {
  name: {
    type: 'string',
    required: true
  }
}, (data, promise)=>{

  promise.resolve(`testing ${ data.name }`);
  
});
```

or using a shorthand:
```js
core.Action('test', {
  name: 'string!'  // <- type 'string' and the '!' means it's required.
}, (data, promise)=>{

  promise.resolve('yey!');
  
});
```



## Routing
The core handles routing through `core.router` and the current routing state is stored on the state tree at `/core/router`.
the router can render any component that was created with `core.Component`.
  
```jsx
core.Component('a', ({ children }) => <div> page a { children }</div>);
core.Component('b', ({ children }) => <div> page b { children }</div>);
core.Component('c', ({ children }) => <div> page c { children }</div>);

location.hash = 'a/b/c';
```

### Rendering
to get the router's rendered result call `core.router.render()` and render the result wherever you like:
```jsx
var ReactDom = require('react-dom');
var core = require('core');

var element = document.getElementById('app');

ReactDom.render(
  <div>
    { core.router.render() }
  </div>
, element);
        
```

If you provide the router with a map object, it will restrict routing to that map.  a default value may be assigned to each level of the map in case of missing or invalid paths.

```jsx
core.router.map([
    { 
      name: 'valid',
      component: 'a',
      children: [
        { 
          name: 'routes',
          component: 'b',
          children: [
            { 
              name: 'only',
              component: 'c',
              children: []
            }
          ]
        }
      ]
    }
  ]);

location.hash = '/valid/routes/only';
```

### Query and route
The core's routing system is designed to enable very complex state to be expressed in your app's address. this allows your apps to have links pointing to a very specific application state. to achieve this flexability a JSON object is being serialized to and from the address bar. this object is called a 'query' because it replaces a query string. 

a common, simple route with a query might look like this:
```
#/store/product/{"id":"xyz"}
```
the router will parse this address, and produce a `route` object - the structure of the current resolved route, and a `query` object - a dynamic routing state.

the `core.router.render()` uses these two objects to produce the rendered tree.

