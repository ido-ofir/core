# core

A boilerplate repo for react and node applications.

### Installation

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

### Startup

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

### Usage

#### Defining core modules
The core contains a module dependency management system that runs on the client.

a module can be anything and the only requirement is that you give it a unique name.

a module with no dependencies can be defined like this:
```js
var core = require('core');

// the first argument is a unique name for the module.
// the second argument is your module, which could be anything.

core.Module('utils', { ... });

```
A module can require other modules using their unique names.

for example this defines a module called 'engine' that requires the module 'utils':
```js
var core = require('core');

core.Module('engine', ['utils'], (utils) => {

  // return your module.
  return {
    ...
  }
});

```
<div>note that the callback will get the modules in the order that you've required them in the array.</div>
<div>also, with this pattern, the callback is expected to return the actual module.</div>

#### Requiring modules
If you only need to get some modules without defining a new one, use the `require` function: 
```js
core.require([
  'engine',
  'utils'
  ], (engine, utils) => {
  
  ...
  
});
```

#### Defining core components

Components can be defined similar to normal modules, using a unique name.

very simple components can be represented as a function:
```jsx
var core = require('core');

core.Component('Cell', props => <div>{ props.text }</div>);

```
more complext components can be defined with an object:
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

#### Application state

<div>The core handles the application's state using a <a href="https://github.com/Yomguithereal/baobab" target="_blank">Baobab</a> tree.</div>
<div>a Baobab tree is a persistent and immutable data structure, which is important for performance optimizations and general application health.</div>
<div>it also provides some useful features, such as undo and redo, out of the box.</div>

### Accessing the Baobab tree
```js
var data = core.tree.get();
```
