
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'renderers.string',
    dependencies: ['ui.Input'],
    get(Input){
      return {
        propTypes: {
          source: 'object',
          onChange: 'func',
          path: 'array'
        },
        getInitialState(){
          return {};
        },
        onChange(text){
          if(this.props.onChange){
            this.props.onChange(this.props.path, text);
          }
        },
        render(){
          var { source } = this.props;
          if(!source) {
            source = '';
          }
          var app = this.app;
          var plugin = app.plugins.renderers;
          var isPlainString = !source['$_type'];
          var value = isPlainString ? source : source.value;
          return (
            <div style={{ height: '100%', display: 'flex'}}>
              <Input type="text" value={ value } onChangeText={ this.onChange }/>

            </div>
          );
        }
      };
    }
};
