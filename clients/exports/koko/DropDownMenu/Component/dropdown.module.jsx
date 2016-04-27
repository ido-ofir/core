var React = require('react');
var PropTypes = React.PropTypes;
var DropDownMenu = require('./DropDownMenu');
var core = require('core');


core.Component('DropDown',{

  saveReportAndCloseEditor(){
    // console.log(1);
    // this.emit('report.update');
  },

  preview(){
    console.log('preview');
  },

  exports(){
    console.log('exports');
  },

  render() {
    var saveMenuItems = [
      {name:'Save & publish', func:this.saveReportAndCloseEditor},
      {name:'Preview', func:this.preview, disabled:true},
      {},
      {name:'Exports', func:this.exports, style:{color:'red'}},
    ]

    return (
      <div ref="koko">
        <DropDownMenu ref="select" title='Save' menuItems={saveMenuItems} style= {{top:53, right:15}}
           menuStyle={{right:-1}} icon={true}/>
      </div>
    );
  }

});
