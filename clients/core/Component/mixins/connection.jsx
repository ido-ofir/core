var React = require('react');
var PropTypes = React.PropTypes;

var connectionMixin = {
  contextTypes: {
    app: PropTypes.object
  },
  getInitialState(){
    var connection = this.connection = this.context.app.connection;
    this.http = {
      get(){
        connection.ajax.get.apply(connection.ajax, arguments).exec();
      },
      post(){
        connection.ajax.post.apply(connection.ajax, arguments).exec();
      },
      put(){
        connection.ajax.put.apply(connection.ajax, arguments).exec();
      },
      delete(){
        connection.ajax.delete.apply(connection.ajax, arguments).exec();
      }
    };
    return null;
  },
  action(){
    this.connection.action.apply(this.connection, arguments);
  },

};

module.exports = connectionMixin;
