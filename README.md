# core

a boilerplate repo for react and node applications.

### installation

this repo is meant to be cloned as the basis for a webapp or a group of webapps.

so just clone the repo and rename it, or copy the files to your own repo.

once you did that you can first install dependencies for the node servers:

```
cd servers
npm install
```

and then for the clients:

```
cd ../clients
npm install
```

installation of client side dependencies may take a while because it includes some compiling tools.

### usage

you can start the default server by running this command from the root of this repo:

```
node run
```

the server would serve all the apps at 'clients/views/' through port 4000.

in 'http://localhost:4000' you should see an index page, which basically displays the contents of `clients/views/`.

the `clients/views/` folder is meant to keep the compiled code of all the seperate client-side apps in the repo, and the server serves this folder as (mostly) static files. 

each link in the index page represents an app in that location, so clicking on a link in this page will open that app in your browser. for example if you click on `app` you we be redirected to `http://localhost:4000/app` so your looking at the app in `clients/views/app/`.

each app is basically a folder with an html page and a webpack configuration in it.

to start developing a client-side app go to its view and run webpack:

```
cd clients/views/app
webpack -w
```

