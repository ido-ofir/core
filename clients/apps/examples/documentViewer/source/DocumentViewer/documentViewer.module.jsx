var React = require('react');
var PropTypes = React.PropTypes;

var _ = require('lodash');
var core = require('core');
var find;
core.Component('DocumentViewer',
  ['ui'],
  (ui) => {

  var { Icon, Box } = ui;

  return {
    getInitialState(){
      return {
        search: '',
        results: [],
        index: 0,
        find: null,
        active: null
      }
    },
    select(items, index){
      var active = this.state.active;
      if(active){
        active.classList.remove('h');
      }
      active = items[index];
      active.classList.add('h');
      this.setState({
        active: active,
        index: index
      });
      this.refs.frame.contentWindow.scrollTo(active);
    },
    next(){
      var find = this.state.find;
      if(!find) return;
      var items = find.items;
      var total = items ? items.length : 0;
      if(!total) return;
      var index = this.state.index;
      index = index + 1;
      if(index > (total - 1)){
        index = 0
      }
      this.select(items, index);
    },
    prev(){
      var find = this.state.find;
      if(!find) return;
      var items = find.items;
      var total = items ? items.length : 0;
      if(!total) return;
      var index = this.state.index;
      index = index - 1;
      if(index < 0){
        index = (total - 1);
      }
      this.select(items, index);
    },
    search(e){
      var value = e.target.value;
      var find = this.state.find;
      this.setState({
        search: value
      });
      if(find){
        find.instance.unmark();
      }
      find = window.x = this.refs.frame.contentWindow.find(value);
      if(find.items.length){
        this.select(find.items, 0)
      }
      this.setState({
        find: find,
        index: 0
      });
    },

    render() {
      var find = this.state.find;
      var total = find ? find.items.length : 0;
      var index = this.state.index;

      return (
        <Box style={ this.props.style }>
          <Box style={{ height: 40, bottom: 'initial' }}>
              <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
                <input value={ this.state.search } onChange={ this.search }/>
                <span>  </span>
                { total } / { index }
                <span>  </span>
                <Icon className="fa fa-chevron-left" onClick={ this.prev }/>
                <Icon className="fa fa-chevron-right" onClick={ this.next }/>
              </div>
          </Box>
          <Box style={{ top: 40 }}>
            <iframe src="pdf.html" style={{ height: '100%', width: '100%' }} ref="frame"></iframe>
          </Box>
        </Box>
      );
    }
  }

});
