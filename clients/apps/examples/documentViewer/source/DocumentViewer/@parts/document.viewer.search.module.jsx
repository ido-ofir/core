var React = require('react');
var PropTypes = React.PropTypes;

var moment = require('moment');
var _ = require('lodash');
var core = require('core');


var search = {
  main: {
    height: '40px',
    width: 'auto',
    borderRadius: '3px',
    alignItems: 'center',
    display: 'flex',
    padding: '0 10px 0 15px',
    top: '50px',
    position: 'absolute',
    zIndex: 1
  },
  input: {
    borderRadius: '4px',
    border: '0',
    outline: '0',
    marginLeft: '1em',
    padding: '1px 5px',
  },
  prevnext: {
    display:'flex',
    alignItems: 'center',
    marginLeft: '0.5em',
  },
  triangle: {
    width: '0px',
    top: '-15%',
    left: '5px',
    height: '0px',
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '0 10px 10px 10px'
    // borderColor: 'transparent transparent #007bff transparent'
  }
};

core.Component('Document.Viewer.Search',
  ['webint.mixin', 'Loader', 'ui.Icon'],
  (mixin, Loader, Icon) => {

  return {
    mixins: [mixin],

    bindings: {
      find: ['api', 'documentViewer', 'find']
    },

    propTypes:{
      isOpen: PropTypes.bool
    },

    getInitialState() {
      return { term : '' };
    },

    handleEnterKey(e){
      if (e.key === 'Enter') {
        core.action('api.documentViewer.find', {
          string: this.state.term
        });
        console.info('you searched:',this.state.term);
      }

    },

    renderCount(){
      var find = this.state.find;
      if(!find) return null;
      return <span style={ {color: this.theme('colors.default'), fontSize: 12} }>{ ` ${find.index + 1} / ${find.length} ` }</span>;
    },

    prev(){
      if(this.state.find){
        this.state.find.prev();
      }
    },

    next(){
      if(this.state.find){
        this.state.find.next();
      }
    },

    render() {
      let { term } = this.state;
      let { isOpen } = this.props;

      return (
        <div if={ isOpen } style={ {...search.main, background: this.theme('colors.primary')} }>
          <div className="triangle" style={ {...search.triangle, borderColor: `transparent transparent ${this.theme('colors.primary')}`} }> </div>
          <span style={ {color: this.theme('colors.default'), fontSize: 12} }>{ this.translate('find','Find') }:</span>
          <input style={ search.input } onKeyPress={ this.handleEnterKey } type='text' value={ term } onChange={ (e)=>{ this.setState({ term: e.target.value  }) } }  />
          { this.renderCount() }
          <div className="prevNext" style={ search.prevnext }>
            <Icon key={'prev'} className="fa fa-arrow-left" style={ { height: '20px', borderRight: '1px solid rgba(152, 162, 167, 0.5)' } }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.prev }
            />
            <Icon key={'next'} className="fa fa-arrow-right" style={ { height: '20px'} }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.next }
            />
          </div>
        </div>
      );
    }
  }

});
