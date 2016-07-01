
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.ListItem', ['ui.ListItem'], (ListItem)=>{



  return {
    getInitialState(){
      return { value: '' };
    },
    render(){

      return (
        <div>
          <h3>ui.ListItem</h3>
            <p>takes no special props</p>
            <pre style={{ display: 'flex' }}>
              {
`<ListItem>One</ListItem>
<ListItem>Two</ListItem>
<ListItem>Three</ListItem>`
               }
            </pre>
            <ListItem>One</ListItem>
            <ListItem>Two</ListItem>
            <ListItem>Three</ListItem>
        </div>
      );
    }
  };
});
