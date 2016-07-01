
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.Card', ['ui.Card'], (Card)=>{



  return {
    getInitialState(){
      return { value: '' };
    },
    render(){

      return (
        <div>
          <h3>ui.Card</h3>
            <p>takes no special props</p>
            <pre style={{ display: 'flex' }}>
              {
`<Card style={{ minHeight: 100, padding: 10 }}>
  Some Content
</Card>`
               }
            </pre>
            <Card style={{ minHeight: 100, padding: 10 }}>
              Some Content
            </Card>
        </div>
      );
    }
  };
});
