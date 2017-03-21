var core = require('core');

var React = require('react');
//https://github.com/malte-wessel/react-custom-scrollbars
// modified to show scroll bar when overed.

import CustomScrollBars from './customScrollBars';
// import CustomScrollBars from 'react-custom-scrollbars';

core.Component('ui.Scroll', {
  render(){
    return (
      <CustomScrollBars { ...this.props }>
        { this.props.children }
      </CustomScrollBars>
    );
  }
});
