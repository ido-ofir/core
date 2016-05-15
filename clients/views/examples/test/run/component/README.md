Wrapper für React Gitter Layout  
===========================

### Wrapper.js
  * ##### get und hold the components list according to the page/state
  * ##### Props
    * **rowHeight** ( Number ) - height in grid units for row ( **default** 150 )

* ##### State
  * **data** ( Array ) - array of object -

```
  [{asdfasdfsdfasdf
    componentName: ''
    maxWidth: '50%',
    maxHeight: '600px'
  }]
```


### Komponenten oder Gitter items (list of objects)
* ##### The components library should have index.js file (for easier loading and listing all of the components in Wrapper)
  - Wrapper.js
    - Components
      - Component.js
      - AnotherComponent.js

      * index.js example:

        ```
          var carousel = require('./Carousel');
        var jumbo = require('./Jumbo');

          module.exports = {
            Carousel: carousel,
            Jumbo: jumbo
          }
        ```
* ##### Each component / grid item should have the props (all in grid units):

  * **width** ( Number ) - initial width
  * **height** ( Number ) - initial height
  * **minWidth**
  * **minHeight**
  * **maxWidth**
  * **maxHeight**
  * **isDraggable** ( Bool ) - if false, will not be draggable. Overrides `static`.
  * **isResizable** ( Bool ) - if false, will not be resizable. Overrides `static`.
  * **isStatic** ( Bool ) - if true, equal to `isDraggable: false, isResizable: false`.


  - If no properties are provided for a grid item, one will be generated with a width and height of 1.
  - Minimums and Maximums for the resizing.

  * Komponente.js example:

    ```

    var Komponente = React.createClass({

      getDefaultProps() {
        return {
          width: 6,
          height: 6,
          minWidth: 5,
          minHeight: 5,
          maxWidth: 12,
          maxHeight: 12,
          isStatic: true
          isDraggable: false,
          isResizable: false
        };
      },
      render() {
        return (  ....  );
      }

    });

    module.exports = Komponente;

    ```
