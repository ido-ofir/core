# core

a boilerplate repo for react and node applications.

### installation

this repo is meant to be cloned as the basis for a webapp or a group of webapps.

so just clone the repo and rename it, or copy the files to your own repo.

once you did that, step into the root of the repo and install it's dependencies:

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

the server should serve all the apps at 'clients/views/' through port 4000.

go to some app's folder and run webpack:

```
cd clients/views/app
webpack -w
```
