var core = require('core');


core.Component('Property', [], () => {
  return {
    propTypes: {
      key: 'string!',
      value: 'any!'
    },
    getInitialState(){
      return {
        isOpen: false
      };
    },
    render(){
      return (
        <div></div>
      );
    }
  };
});
core.Component('DevTools', ['ColorPicker', 'socket', 'AceEditor'], (ColorPicker, socket, AceEditor) => {
  return {
    getInitialState(){
      return {
        selectedColor: null
      };
    },
    componentDidMount(){
      socket.on('set', this.setSource);
    },
    setSource(data){
      core.tree.set(['core', 'source'].concat(data.path), data.value);
    },
    selectColor(color, path){
      this.setState({ selectedColor: color });
      socket.action('set', { path: path, value: color.value });
    },
    render(){
      return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom:0, display: 'flex' }}>
          <div>
            {
              core.bind('core.source', source => {
                return (
                  <div>
                    { Object.keys(source.core).map(key => <div key={ key }>{ key }</div>) }
                  </div>
                );
              })
            }
          </div>
          <AceEditor/>
        </div>
      );
    }
  }
});
