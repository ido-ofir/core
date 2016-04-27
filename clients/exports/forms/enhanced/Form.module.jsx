var React = require('react');
var { PropTypes } = React;
var formMixin = require('./mixins/form.jsx');
var core = require('core');
 module.exports = core.Component('Form', {
   mixins: [formMixin],

   propTypes: {
     form: PropTypes.object
   },


   render() {
     return (
      <div style={this.props.style} id={ this.props.id }>
        { this.props.children }
      </div>
     );
   }
 });
