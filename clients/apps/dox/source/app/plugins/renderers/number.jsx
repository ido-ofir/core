
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'number',
    dependencies: [],
    get(){
      return {
        propTypes: {
          app: 'object',
          source: 'object',
          onChange: 'func',
          id: 'any'
        },
        getInitialState(){
          return {};
        },
        render(){
          var { source } = this.props;
          if(!source) {
            console.log('no source');
            return null;
          }
          var app = this.app;
          var plugin = app.plugins.renderers;
          var isPlainNumber = (source['$_type'] === 'number');


          return (
            <div style={{ height: '100%', display: 'flex'}}>
              <div style={{ flex: 1, maxWidth: 120, minWidth: 120 }}>
                {
                  isPlainNumber ? source : source.value
                }
              </div>

            </div>
          );
        }
      };
    }
};
