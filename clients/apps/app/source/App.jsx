var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

// core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
// core.loadContext('source', require.context('./', true, /.*\.module\.js/));


core.App({
  name: 'loko',
  tree: {
    x: 5
  },
  components: [{
    name: 'a',
    dependencies: ['X'],
    get(X){
      return props => <div>AAA - <X/></div>;
    }
  },{
    name: 'X',
    dependencies: [],
    get(){
      return p => this.bind('x', x => <div>{ x }</div>);
    }
  }],
  actions: [{
    name: "doit",
    schema: {
      a: {
        required: true,
        types: ['object']
      }
    },
    run(){
      this.set('x', 7);
    }
  }],
  render(cb){
    this.require(['a'], a => cb(a))
  },
  init(){

  }
});

core.require('loko', (loko) => {
  window.loko = loko;
  loko.render(UI =>
    {
      ReactDom.render(<UI/>, document.getElementById('app'))
    }
  );

});
