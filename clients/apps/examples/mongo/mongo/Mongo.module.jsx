var React = require('react');
var pr = React.PropTypes;
var core = require('core');

core.Component('Mongo', [
  'mongo.Collections',
  'mongo.tree',
  'mongo.socket'
], (Collections, tree, socket)=>{

  return {
    getInitialState(){
      return {
        data: tree.get()
      };
    },
    init(){
      core.action('mongo.getCollectionsList');
    },
    componentDidMount(){
      tree.on('update', this.update);
      socket.run(this.init);
    },
    componentWillUnmount(){
      tree.off('update', this.update);
    },
    update(){
      this.setState({
        data: tree.get()
      });
    },
    render(){
      var data = this.state.data;
      return (
        <div style={{height: '100%'}}>
          <Collections data={ data }/>
        </div>
      );
    }
  };
});
