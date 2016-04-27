var React = require('react');
var PropTypes = React.PropTypes;

var styles= {

  saveBtn:{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      alignItems:'center',
      height:35,
      width: 100,
      zIndex: 1,
      border:'1px solid #9E9E9E',
      background: '#333333',
      borderRadius:4,
      cursor: 'pointer'
  },

  saveText:{
    color: 'white',
    fontWeight: 500,
    fontSize: 13,
  },

  saveIcon:{
    color: 'white',
    fontWeight: 500,
    fontSize: 13,
    marginLeft:5,
    marginRight:5,
    cursor: 'pointer'
  },

  dropDown:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around',
    position:'absolute',
    width:144,
    height:100,
    right: -10,
    top: 20,
    background:'white',
    border:'1px solid #9E9E9E',
    borderRadius: 4
  },

  menuItem:{
    paddingLeft:10,
    cursor: 'pointer'
  },

  divider:{
    width:'100%',
    height:1,
    background:'#CCC'
  }
}


 module.exports = React.createClass({

   propTypes: {
     title: PropTypes.string.isRequired,
     menuItems: PropTypes.array.isRequired,
     style: PropTypes.object,
     menuStyle: PropTypes.object,
     icon: PropTypes.bool
   },

   getDefaultProps () {
     return {
       icon: true
     }
   },

   getInitialState(){
    return {
        openSaveMenu: false,
      };
   },

   componentDidMount(){
     this.menuKey = 0;
     document.body.addEventListener('click',this.close,false);
   },

   componentWillUnmount(){
     document.body.removeEventListener('click',this.close,false);
   },

   handleOnClick(){
     if (this.menuKey === 0){
       this.setState({openSaveMenu: false});
     } else {
       this.setState({openSaveMenu: true});
       this.menuKey = -1;
     }
   },

   handleDisabledClick(){
    this.menuKey= 1;
   },

   close(){
     this.menuKey++;
     this.setState({openSaveMenu: false});
   },

   renderMenuItems(){
     return this.props.menuItems.map(this.renderSingleMenuItem);
   },

   renderSingleMenuItem(menuItem, key){
     var menuItemStyle= {
       ...styles.menuItem,
       ...menuItem.style
     }

     var disabledStyle= {
       ...menuItemStyle,
       color: '#CCC',
       cursor: 'not-allowed',
     }

     if (!menuItem.name) return ( <span key={key} style={styles.divider}/> );

     if (menuItem.disabled){
       return (
         <span key={key} style={disabledStyle} onClick={this.handleDisabledClick} >{menuItem.name}</span>
       )
     }
     return (
       <span key={key} style={menuItemStyle} onClick={menuItem.func}>{menuItem.name}</span>
     )
   },

   renderIcon(){
     if (this.props.icon===false) return null;

     return(
       <div style={{display: 'flex', alignItems: 'center'}}>
         <span style={{width:1, height:35, background:'#9E9E9E'}}/>
         <div style={styles.saveIcon} className="glyphicon glyphicon-chevron-down" />
       </div>
     );
   },

   render() {
     var dropDownStyle= {
       ...styles.dropDown,
       ...this.props.menuStyle,
       display: this.state.openSaveMenu ? 'flex' : 'none' };
    var saveBtnStyle= {
      ...styles.saveBtn,
      ...this.props.style
    }

     return (
       <div className="save-btn" onClick= {this.handleOnClick} onBlur= {this.handleOnBlur} style={saveBtnStyle}>
         <div style={{display:'flex',flex:1, justifyContent:'center', alignItems:'center'}}>
            <div style={styles.saveText}>Save</div>
         </div>
         {this.renderIcon()}
         <div style={{position:'relative'}}>
           <div style={dropDownStyle}>
             {this.renderMenuItems()}
           </div>
         </div>
       </div>
     );
   }
 });
