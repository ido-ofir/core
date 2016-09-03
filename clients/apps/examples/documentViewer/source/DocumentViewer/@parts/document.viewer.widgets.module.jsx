var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var _ = require('lodash');

core.Component('Document.Viewer.Widgets',[
  'webint.mixin', 'Widget.Box', 'generic.Drawer',
  'Split.Icons.Button',
  'generic.buttons', 'Button.Option'],
(mixin, WidgetBox, Drawer, SplitIconsButton, buttons,  OptionsButton)=>{
  var styles = {
    info: {
      display:'flex',
      flexDirection:'column',
      height:'100%',
      minWidth: '320px',
      width: '320px',
    },
  };


  return {
    mixins:[mixin],

    bindings: {
      facets : ['config', 'documentViewer', 'facets'],
    },

    propTypes: {
      data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
      ]),
    },

    toggleFacetDrawer(e){
      core.action('api.documentViewer.toggleDocFacetDrawer', { label: e })
    },

    changeViewComponent(item, view){
      // console.info(item, view);
      core.action('api.documentViewer.setDocFacetView', {
        item: item,
        view: view.title
      });
    },

    makeButton(type, item, index){

      switch(type){
        case 'sort':
          var views = [];
          for(var m in item.views){
              views.push({
                className : item.views[m].toLowerCase(),
                title : item.views[m],
                limit : item.limit || 0
              });
          }
          return (
            <SplitIconsButton
              key={ index }
              theme="hollow"
              options={ views }
              onSelect={ this.changeViewComponent.bind(this, item) }
              selectedView={ this.getSelectedView(item, views) } />
          );
        break;
        case 'dateRange':
          return (
            <buttons.DateRange key={ index } onSelect={ this.selectDateRange } item={ item }/>
          );
        break;
        case 'calendar':
          return (
            <OptionsButton key={ index } position="right" onOption={this.onOptionClicked}>
              <MenuItem>option a</MenuItem>
              <MenuItem>option b</MenuItem>
            </OptionsButton>
          );
        break;
      }
      return null;
    },

    getBadge(item, length){
      return item.badge && (length || '0');
    },

    getViews(item){
      var temp = [];
      for(var m in item.views){
          temp.push({
            className : item.views[m].toLowerCase(),
            title : item.views[m],
            limit : item.limit || 0
          });
      }
      return temp;
    },

    getSelectedView(item, views) {
      for (var x in views) {
        if (views[x].className === item.selectedView.toLowerCase()) {
          return views[x];
        }
      }
    },

    onAppliedBucket(e){
      console.log(e);
    },

    buildDrawers(item, key){
      var views = this.getViews(item);
      var selectedView = this.getSelectedView(item, views);
      var buttons = item.buttons.map((btn, index)=>{ return this.makeButton(btn, item, index) });
      var data = item.data || [];
      var badge = this.getBadge(item, data.length);

      return (
        <Drawer
          if={ data && data.length }
          key={ key }
          badge={ badge }
          selectable={ false }
          item={ item }
          onApply={ this.onAppliedBucket }
          isLoading={ this.props.loading }
          selectedView={ selectedView }
          buttons={ buttons }
          onToggle={ this.toggleFacetDrawer }
          data={ data } />
      );
    },

    render() {
      let { facets } = this.state;
      return (
        <WidgetBox key={ 'WidgetsPanel' } style={ styles.info } noHeader={ true } bodyStyle={ {overflowY: 'scroll', paddingRight: '0.3em'} }>
          { facets && facets.length ? _.map(facets, this.buildDrawers) : null }
        </WidgetBox>
      );
    }
  }
})
