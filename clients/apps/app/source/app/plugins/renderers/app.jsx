
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.app',
    dependencies: [
      'renderers.object',
      'renderers.fields',
      'renderers.typedObject',
    ],
    get(Object, Fields, TypedObject){

      var app = this;
      return {
        propTypes: {
          map: 'object',
          source: 'object',
          onChange: 'func',
          path: 'array'
        },
        render(){

          var source = this.props.source;
          if(!source) return null;
          return (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <TypedObject { ...this.props }/>
            </div>
          );
        }
      };
    }
};
