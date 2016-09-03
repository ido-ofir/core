var React = require('react');
var pt = React.PropTypes;
var ReactDom = require('react-dom');
var core = require('core');

core.loadContext('modules', require.context('modules', true, /.*\.module\.js/));
core.loadContext('source', require.context('./', true, /.*\.module\.js/));

var items = [
  { title: 'aaa', body: 'bbb', content: 'ccc' },
  { title: 'aaa', body: 'bbb', content: 'ccc' },
  { title: 'baa', body: 'bbb', content: 'ccc' },
  { title: 'baa', body: 'bbb', content: 'ccc' },
  { title: 'caa', body: 'bbb', content: 'ccc' },
  { title: 'caa', body: 'bbb', content: 'ccc' },
  { title: 'daa', body: 'bbb', content: 'ccc' },
  { title: 'daa', body: 'bbb', content: 'ccc' },
  { title: 'faa', body: 'bbb', content: 'ccc' },
  { title: 'faa', body: 'bbb', content: 'ccc' }
]

function renderSummaryTitle(item) {
  return <span>wow</span>
}
function renderSummaryContent(item) {
  return <span>{ item.body } Small</span>
}
function renderSummaryBody(item) {
  return <span>{ item.body } Small</span>
}
function renderSummaryIcon(item) {
  return <div>i</div>
}
function renderSummaryContent(item) {
  return <span>{ item.content } </span>
}
function renderTitle(item) {
  return <div>{ item.title } Big</div>
}
function renderBody(item) {
  return <div>{ item.body } Big</div>
}
function renderIcon(item) {
  return <div>i</div>
}


function filterItem(item, v) {
  return (item.title.toLowerCase().indexOf(v.toLowerCase()) === 0);
}

var Test = core.Component('Test', ['InboxList', 'ui.Box', 'ui.Input'], (InboxList, Box, Input)=>{
  return {
    getInitialState(){
      return {
        items: items.filter(t => t),
        query: ''
      };
    },
    filter(e){
      var v = e.target.value;
      var t = items.filter((t) => filterItem(t, v));
      this.setState({
        query: v,
        items: t
      })
    },
    render(){
      return (
        <Box>
          <Box style={{ height: 60, bottom: 'initial' }}>
            <Input value={ this.state.query } onChange={ this.filter }/>
          </Box>
          <Box style={{ top: 60}}>
            <InboxList items={ this.state.items }
                  renderSummaryTitle={ renderSummaryTitle }
                  renderSummaryBody={ renderSummaryBody }
                  renderSummaryIcon={ renderSummaryIcon }
                  renderSummaryContent={ renderSummaryContent }
                  renderTitle={ renderTitle }
                  renderBody={ renderBody }
                  renderIcon={ renderIcon }></InboxList>
          </Box>
        </Box>

      );
    }
  };
});

var element = document.getElementById('app');
core.require([
  'core.App', 'Test'], (App, List)=>{

    ReactDom.render(
      <App style={{ padding: 20 }}>
        <Test/>
      </App>, element);

})
