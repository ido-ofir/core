




to start a dev server with hot module reload

    npm start

to build:

    webpack
    
webpack will bundle all vendor modules to build/vendor.bundle.js
webpack will bundle all your source modules from 'app' folder to build/bundle.js

globals:

   'React'  is global. just use React instead of require('react/addons')
   'cx'  is global. just use cx instead of require('classnames')
