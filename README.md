# core

a boilerplate repo for react and node applications.

### installation

this repo is meant to be cloned as the basis for a webapp or a group of webapps.

so just clone the repo and rename it, or copy the files to your own repo.

make sure <a href="https://nodejs.org/en/">node</a> is installed on your machine.

step into the root of the repo and install dependencies:

```
npm install
```

installation may take a while because it includes some compiling tools.

make sure webpack is installed globally:

```
npm install -g webpack
```

### startup

start the default server by running this command from the root of this repo:

```
node run
```

the server should serve all the apps at 'clients/apps/' through port 4000.

go to some app's folder and run webpack:

```
cd clients/apps/app
webpack -w
```

 ### usage

 #### defining core modules
the core contains a module dependency management system that runs on the client.
a module can be anything and the only requirement is that you give it a unique name.
a module with no dependencies can be defined like this:
```js
var core = require('core');

// the first argument is a unique name for the module.
// the second argument is your module, which could be anything.
core.Module('utils', { ... });

```
modules can get a reference to other modules as dependencies using their unique name.
```js
var core = require('core');

// here the second argument is an array of dependencies and the third
core.Module('engine', ['utils'], (utils) => {

  // return your module.
  return {
    ...
  }
});

```
