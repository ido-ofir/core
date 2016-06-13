var core = require('core');

import {List, MakeSelectable} from 'material-ui/List';

var SelectableList = MakeSelectable(List);

core.Component('SelectableList', [], ()=>{

    return {
      render(){
        return (<SelectableList { ...this.props }>{ this.props.children}</SelectableList>);
      }
    };
});
