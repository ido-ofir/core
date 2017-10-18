
var React = require('react');
var Select = require('react-select');
import 'react-select/dist/react-select.css';

module.exports = {
    $_type: 'component',
    name: '$_type',
    dependencies: [
      'renderers.fields'
    ],
    get(Fields){
      var app = this;
      return {
        propTypes: {
          map: 'object',
          source: 'object',
          onChange: 'func',
          path: 'array'
        },
        onChange(value){
          if(this.props.onChange){
            this.props.onChange(this.props.path, value);
          }
        },
        render(){
          // console.debug('this', source);
          
          
          var { source, map } = this.props;
          if(!map){
            console.debug('source', source);
            
          }
          var options = map.type ? map.type.map(t => ({ label: t.name, value: t.name })) : [];
          return <Select options={ options } onChange={ this.onChange } value={ source } style={{ width: 120 }}/>;
        }
      };
    }
};
