var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');
require('./style.css');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
core.loadContext(require.context('./', true, /.*\.module\.js/));

var style = {
  padding: 20,
  margin: 20,
  border: '1px solid #ddd'
};

var pageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

var innerPageStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

core.Action('test', {
  one: {
    type: 'string',
    required: true,
    description: 'the one argument'
  },
  two: 'number!'
}, (data, promise)=>{
  promise.resolve('yey!');
});

core.on('leftKey', core.router.back)
core.on('rightKey', core.router.forward)

core.Action('toggleMap', (params, promise)=>{

  var map = core.tree.get(['core', 'router', 'map']);
  if(map){
    core.router.map(null);
    core.tree.set(['routerMap'], map);
  }
  else{
    core.router.map(core.tree.get(['routerMap']));
  }

});

core.on('error', (err)=>{
  console.error(err && (err.error || err));
});

core.Component('a', ({ children }) => <div style={ style }> page a { children }</div>);
core.Component('b', ({ children }) => <div style={ style }> page b { children }</div>);
core.Component('c', ({ children }) => <div style={ style }> page c { children }</div>);

core.router.on();


core.Component('first', ({ children }) => <div style={ pageStyle }>
  first
  <div style={{ ...pageStyle, top: 50 }}>{ children }</div>
</div>);
core.Component('second', ({ children }) => <div style={ pageStyle }>
  second
  <div style={{ ...pageStyle, top: 50 }}>{ children }</div>
</div>);
core.Component('third', ({ children }) => <div style={ pageStyle }>
  third
  <div style={{ ...pageStyle, top: 50 }}>{ children }</div>
</div>);

// core.on('update', (updatedPaths)=>{
//   console.log(updatedPaths);
// });

var element = document.getElementById('app');
core.require([
  'core.App', 'ui.Button'], (App, Button)=>{

    ReactDom.render(
      <App>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ flex: 1, position: 'relative'}}>
            {
              core.router.render()
            }
          </div>
          <div style={{ flex: 1}}>
            {
              core.bind(['core','router'], router =>

                <pre style={{ flex: 1, overflow: 'auto', height: '100%', position: 'relative' }}>
                  <Button onClick={ e => core.run('toggleMap')} size="small" style={{ width: 100, height: 24, right: 10, position: 'absolute', top: 10}}>map</Button>
                  { JSON.stringify(router, null, 4) }
                </pre>

              )
            }
          </div>
        </div>
      </App>, element);

})
