var core = require('core');

core.Component('Find', {
  render(){
    return (
      <div>
        ok find
        { this.props.children }
      </div>
    );
  }
});
