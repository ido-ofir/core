
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.action',
    dependencies: [
      'renderers.fields'
    ],
    get(Fields){

      return {
        propTypes: {
          map: 'object',
          source: 'object',
          onChange: 'func',
          path: 'array'
        },
        render(){

          var source = this.props.source;
          if(!this.props.source) return null;
          return <Fields { ...this.props }/>;

        }
      };
    }
};
