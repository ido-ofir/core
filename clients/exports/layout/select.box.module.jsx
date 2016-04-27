var React = require('react');
var PropTypes = React.PropTypes;
import {Input} from 'react-bootstrap';
// var theme = require('../theme.js');

import cx from 'classnames';
require('./select.box-module.scss')
var _ = require('lodash');
var core = require('core');
core.Component('Select.Box.Button',['webint.mixin','layout'],(mixin,layout)=>{

return {
    mixins:[mixin],
    propTypes:{
      hide: PropTypes.bool,
      label: PropTypes.string,
      options: PropTypes.array,
      selected: PropTypes.string,
      onSelect: PropTypes.func,
      size: PropTypes.string, // 'sm || md'
      theme: PropTypes.string //'default, primary, secondary'
    },
    getDefaultProps(){
      return {
        hide: true,
        theme:'default',
        size:'md'
      }
    },
    getInitialState(){
      return {
        hide:true,
        options: this.props.options,
        selected: this.props.value || this.props.options[0].title,
        show: false
      };
    },

    onSelect(option){
      console.dir(option);
      this.setState({
        selected: option.title,
        show : false
      });

      this.props.onSelect(option);
    },

    renderSortOptions(){
      const { selected, show } = this.state;
      if (!show)
        return;
      var options = this.props.options;
      var optionCSS = {
        cursor: 'pointer',
        padding: '10px',
        borderBottom: `1px solid ${this.theme('colors.border')}`,
        fontSize: '11px',
      }


      return (
        <div className="option-box ${this.props.size}">
          {_.map(options, (opt, e) => {
            var option = (opt instanceof Object) ? { ...opt, eventKey:e} : { val: opt, title: opt, opt, eventKey:e };
            return (
              <div
                key={e}
                className={ `option-item ${this.props.theme}` }
                style={{...optionCSS,
                  color: (option.title === this.state.selected) ? this.theme('colors.secondary') : this.theme('hovers.primary')
                }}
                onClick={ this.onSelect.bind(this, option) }>
               {option.title}
             </div>
            )
          }) }
        </div>
      );

    },

    toggleOptions(){
      this.setState({ show : (typeof this.state.show === "boolean") ? !this.state.show : true });
    },

    render () {
      //const hasOptions =
      const { selected, show } = this.state;
      const showOptions = show && Array.isArray(this.props.options) && !!this.props.options.length;
      var selectBox = {
        wrap:{},
        selectedWrap: {
          position: 'relative'
        },
        selected: {
          color: this.theme('colors.primary'),
          cursor: 'pointer',
        }

      }

      var className = "optionbox-holder "+ this.props.theme +" "+this.props.size;

      return (
        <div className={className} onClick={ this.toggleOptions }>
          { this.props.label ? this.props.label + ': ' : null}
          <span className="optionbox-selectedwarp" >
            <span className="optionbox-selected">{ selected }</span>

            { showOptions && this.renderSortOptions() }
            { this.props.children && this.props.children }
            <i className="option-icon fa fa-caret-down"></i>
          </span>
        </div>
      );
    }
  }
});
