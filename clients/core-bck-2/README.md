# client-core

### Inheritance

* #### Instance inheritance
  An app inherites from core. a plugin defined in an app will inherit from the app.
a type instance can inherit from the app or from a plugin that it is defined in.

```javascript
core.build({
    $_type: 'app',
    name: 'myApp',
    doStuff(){
      alert('stuff is getting done')
    },
    plugins: [{
      $_type: 'plugin',
      name: 'myPlugin',
      test(){
        alert('plugin test')
      }
    }]
  }, (myApp)=>{
    var { myPlugin } = myApp.plugins;
    myApp.doStuff();
    myPlugin.test();
  });

  
```

* #### Type inheritance
  A type can inherit from another type:
  ```javascript
  core.build({
    $_type: 'type',
    name: 'component',
    extends: 'module'
  })
  ```
  
### Types

The base collection of all types.

Implementation should take into consideration the build digest cycle
and source updates as well as the precedence and inharitance features.

* ### Build cycle and source updates

  Build of source takes place when an app bootstraps, but also when 
  a change to the source has been made and only a part of the app
  needs to be rebuilt.  
  this allows the app to be edited externally ( or internally ) at run time.
  
  The build cycle is divided into phases that allow a certain type to
  have more flexability over the way it is being built or updated / deleted
  from source.

  The build is getting one value at a time and it checks if the value 
  is a typed object. a typed object has a `$_type` property on it, which is just 
  a string name of a type:
  
  ```json
  {
    "$_type": "boolean",
    "value": true
  }
  ```

  When the build reaches a typed object it grabs the type definition from 
  the app's internal types registery. it then inspects the type definition 
  looking for certain properties on it.  
  these properties include:

  * __recursive__ : `boolean` - should the object's children be recursively built automatically? 
  * __init__ : `function` - runs before the build starts for the first time.
  use this function if you need to initialize something for your type,
  like a namespace to store instances.
  * __preBuild__ : `function` - recieves the source before any of the children have been built.
  this is useful when the `recursive` flag is `true`, and you want to change the source that will
  be passed down to the object's children.  
  expected to return a new source that will be used in the rest of the build.
  * __build__ : `function` - recieves the source after all children have been built.
  if `recursive` is not set to `true` this function will get the original source (or 
  the source that `preBuild` has returned).
  * __validate__ : `function` - explicitly validate an instance of this type.  
  * __set__ : `function` - this function will be called after a typed object has
  been built and it's purpose is to store the result somewhere.
  * __schema__ : `object` - an object describing the structure that the type expects
  it's source to have. the schema can be used to validate a typed object,
  but it's also very useful as the blueprint for a GUI.
    
  ```javascript
  {
    "$_type": "type",
    "name": "user",
    "recursive": true,
    "async": true,
    "schema": {
      "firstName": { 
        "type": "string",
        "description": "The first name of the user.",
        "isRequired": true,
        "value": ""
      },
      "lastName": { 
        "type": "string",
        "description": "The last name of the user.",
        "isRequired": false,
        "value": ""
      }
    },
    init(){
      this.app.users = {};
    },
    preBuild(source){
      var newSource = { ...source };
      newSource.id = core.utils.uuid();
      return newSource;
    },
    build(source){
      var name = `${source.firstName} ${source.lastName}`;
      return { ...source, name: name }
    },
    set(user){
      this.users[user.name] = user;
    }
  }
  ``` 
