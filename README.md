# core

A boilerplate repo for react and node applications.

* [Installation](#installation)
* [Startup](#startup)
* [Modules and components](#modules-and-components)
  - [Defining core modules](#defining-core-modules)
  - [Requiring modules](#requiring-modules)
  - [Defining core components](#defining-core-components)
* [Application state](#application-state)
  - [Accessing the Baobab tree](#accessing-the-baobab-tree)
  - [Bindings](#bindings)
  - [Binding components](#bindings-components)
* [Routing](#router)
  - [Rendering](#rendering)
    * [Free mode](#free-mode)
    * [Mapped mode](#mapped-mode)
  - [Query](#query)
  - [Route](#route)

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

core.tree.set('tableCells', ['one', 'two', 'three']);

core.Component('Table', ['Cell'], (Cell)=>{

  return {
    bindings: {
      cells: ['tableCells']
    },
    render(){
    
      return (
        <div>
          { this.state.cells.map((cell, i) => <Cell key={ i } text={ cell }/>) }
        </div>
      );
      
    }
  };
  
});
```
this will cause the `Table` component to update `cells` on it's state whenever `tableCells` changes on the tree.

however in some cases it could be more convenient to make this binding 'on the fly'. the `core.bind` method creates a place inside your rendered react tree that is bound to a part of the app's state:

```jsx
core.Component('Table', ['Cell'], (Cell)=>{

  return {
    render(){
    
      return (
        <div>
          {
            core.bind('tableCells', cells => 
              cells.map((cell, i) => <Cell key={ i } text={ cell.text }/>)
            )
          }
        </div>
      );
      
    }
  };
  
});
```
now, changing the `tableCells` array will cause the `Cell`s to re-render, but not the whole `Table` component.
the `core.bind` method will run the function on every update and use the returned value to update the ui.


## Routing
The core handles routing through `core.router` and the current routing state is stored on the state tree at `/core/router`. 

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
the actual rendering logic of the router can be in a 'free' or a 'mapped' mode. both modes allow infinite nesting of routes and they both use a json based query for serializing the routing state. the router uses `core.components` to select components to render. `core.components` holds all the components that were created using `core.Component`.

#### Free mode
In free mode every component created with `core.Component` can be rendered by using it's name. this mode may be handy during development as it lets you structure your app dynamically before hard-coding it's actual structure.
```jsx
core.Component('Main', props => <div>Main page</div>);

location.hash = 'Main';
```

#### Mapped mode
In mapped mode a map object is provided to the router and only components permitted by this map may be rendered to screen.  a default value may be assigned to each level in case of missing or invalid paths.

```jsx
core.tree.set(['core', 'router', 'map'], [{ name: 'welcome', type: 'Main' }])

core.Component('Main', props => <div>Main page</div>);

location.hash = 'welcome';
```

### Query
The core's routing system is designed to enable very complex states to be expressed in your app's address. this allows your app to have links pointing to a very specific application state. to achieve this flexability a JSON object is being serialized to and from the address bar. this object is called a 'query' because it replaces a query string. 

a common, simple route with a query might look like this:
```
#/store/product/{"id":"xyz"}
```
the router will parse this address, extract the object `{"id":"xyz"}` and set it to the tree at `/core/router/query`.  it is worth mentioning that in more complex situations the query object will obey immutability rules during state transition, so that you can tell what actualy changed in the query and what didn't.

### Route
The route object is produced from the 'slashed' part of the hash. for example an address like this:
```
#/store/product/{"id":"xyz"}
```
would produce a route object that looks like this:
```json
[
  {
    "name": "store",
    "type": "Store",
    "children": [
          {
        "name": "product",
        "type": "Product",
        "children": []
      }
    ]
  }
]
```
the `core.router.render()` method will transform this object to a tree of react elements ready to be rendered. every level in this object will have a 'type' property which is a name of a component in `core.components`.



