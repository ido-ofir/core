var React = require('react');
var PropTypes = React.PropTypes;

var moment = require('moment');
var _ = require('lodash');
var core = require('core');


var bar = {
  main: {
    height: 40,
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    padding: '0 15px',
    zIndex: 1
  },
  zoom: {
    display:'flex',
    alignItems: 'center',
    marginLeft: '0.5em',
  }
};

core.Component('Document.Viewer.Bar',
  ['webint.mixin', 'Loader', 'ui.Icon',
    'Document.Viewer.Search',
    'Document.Viewer.Pages'
  ],
  (mixin, Loader, Icon, SearchBar, Pages) => {

  return {
    mixins: [mixin],

    propTypes:{
      numPages: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      currentPage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      zoom: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    },

    getInitialState() {
      return { searchOpen : false, zoom: 100 };
    },

    toggleSearchBar(){
      this.setState({ searchOpen: !this.state.searchOpen })
    },
    setZoom(e){
      var { zoom } = this.state;
      switch (e) {
        case 'out':
          zoom = zoom-20;
          if (zoom === 0) return;
          else this.setState({ zoom: zoom })
          break;
        case 'in':
          zoom = zoom+20;
          if (zoom > 200) return;
          else this.setState({ zoom: zoom })
          break;
      }
    },
    render() {
      let { searchOpen, zoom } = this.state;
      let { numPages, currentPage } = this.props;

      var icon = { background: searchOpen ? 'rgba(21,21,21,0.3)' : 'none', marginRight: 15 };

      return (
        <div style={ {...bar.main, background: this.theme('colors.primary')} }>
          <Icon className="fa fa-search" key={ 'search' } onClick={ this.toggleSearchBar }
                onColor={ this.theme('colors.default') }
                offColor={ this.theme('hovers.text') }
                active={ searchOpen }
                style={ icon }
                activeColor={ this.theme('colors.default') } />

          <Pages pages={ {numPages: numPages, currentPage: currentPage} } />

          <div className="prevNext" style={ bar.zoom }>
            <Icon key={'zoom-out'} className="fa fa-minus" style={ { height: '20px', borderRight: '1px solid rgba(152, 162, 167, 0.5)' } }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.setZoom.bind(this, 'out') } />
            <Icon key={'zoom-in'} className="fa fa-plus" style={ { height: '20px'} }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.setZoom.bind(this, 'in') } />
            <div style={ {background: 'rgba(21,21,21,0.3)', borderRadius: '3px', width: '45px', textAlign: 'center', color: '#ddd'} }>
              { zoom }%
            </div>
          </div>


          <SearchBar isOpen={ searchOpen }  />
      </div>
      );
    }
  }

});
