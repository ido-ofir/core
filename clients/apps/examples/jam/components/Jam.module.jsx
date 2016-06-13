var core = require('core');

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {List, ListItem, MakeSelectable} from 'material-ui/List';


core.Component('Jam', [
  'SelectableList',
  'mongo.socket'], (SelectableList)=>{

    return {
      getInitialState(){
        return {
          isOpen: false,
          value: 'Find'
        }
      },
      handleToggle(){
        this.setState({ isOpen: !this.state.isOpen })
      },
      change(value){
        console.log(5);
        console.log(value);
        this.setState({ value: value });
      },
      componentDidMount(){
        window.router = this.refs.router;
      },
      render() {
        return (
          <div style={{ height: '100%'}}>


          <div style={{
            position: 'absolute',
            top: 0,
            left: 200,
            bottom: 0,
            right: 0}}>
            <AppBar
              title={ this.state.value }
              showMenuIconButton={ false }
            />
          <core.Router components={ core.components } ref="router"/>

          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 200,
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'}}>
            <SelectableList onChange={this.handleRequestChange} value={this.state.value}>
              <ListItem primaryText="Find" value="Find" onClick={ this.change.bind(this, 'Find') }/>
              <ListItem primaryText="Play" value="Play" onClick={ this.change.bind(this, 'Play') }/>
              <ListItem primaryText="Profile" value="Profile" onClick={ this.change.bind(this, 'Profile') }/>
            </SelectableList>
          </div>
          </div>
        );
      }
    };
});
