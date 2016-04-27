var React = require('react');
var { PropTypes } = React;
var formMixin = require('./mixins/form.jsx');

 module.exports = React.createClass({
   mixins: [formMixin],

   propTypes: {
     form: PropTypes.object
   },


   render() {
     return (
      <div style= {this.props.style}>
        { this.props.children }
      </div>
     );
   }
 });
