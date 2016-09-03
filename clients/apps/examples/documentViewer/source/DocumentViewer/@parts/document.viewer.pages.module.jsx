var React = require('react');
var PropTypes = React.PropTypes;

var moment = require('moment');
var _ = require('lodash');
var core = require('core');


var pagestyle = {
  main: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  input: {
    borderRadius: '4px',
    margin: '0 0.1em 0 0.5em',
    padding: '1px 5px',
    textAlign: 'center',
    height: '20px',
    outline: 'none',
    border: '0',
    maxWidth: 45,
    background: 'rgba(21, 21, 21, 0.3)',
    color: '#fff'
  },
  prevnext: {
    display:'flex',
    alignItems: 'center',
    marginLeft: '0.5em',
  },

};

core.Component('Document.Viewer.Pages',
  ['webint.mixin', 'Loader', 'ui.Icon'],
  (mixin, Loader, Icon) => {

  return {
    mixins: [mixin],

    propTypes:{
      pages: PropTypes.object // { currentPage: 1, numPages: 4 }
    },

    getInitialState() {
      return { currentPage : '', numPages: '' };
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.pages !== this.props.pages) {
        this.setPages(nextProps.pages)
      } else this.setPages(this.props.pages)
    },
    setPages(pages){
      this.setState({
          currentPage: pages.currentPage,
          numPages: pages.numPages
      })
    },
    prevNext(e){
      var { currentPage, numPages } = this.state;
      switch (e) {
        case 'next':
          if (currentPage < numPages){
            currentPage ++;
            this.setState({ currentPage: currentPage })
          } else return;
          break;
        case 'prev':
          if (currentPage > 1){
            currentPage --;
            this.setState({ currentPage: currentPage })
          } else return;
          break;
      }
    },

    render() {
      let { pages } = this.props;
      let { currentPage, numPages } = this.state;
      return (
        <div style={ pagestyle.main }>

          <div className="pager" style={ {display: 'flex', color: this.theme('hovers.text'), margin: 0} }>
            <span>{this.translate('pages', 'Pages')}:</span>
            <input style={ pagestyle.input } type="number"
              min={ 1 }
              max={ numPages }
              value={ currentPage }
              onChange={ (e)=>{ this.setState({ currentPage: e.target.value }) } }/>
            <div> <span>/</span> <span style={ {marginLeft: '0.2em'} }>{ numPages }</span> </div>
          </div>

          <div className="prevNext" style={ pagestyle.prevnext }>
            <Icon key={'prev'} className="fa fa-arrow-down" style={ { height: '20px', borderRight: '1px solid rgba(152, 162, 167, 0.5)' } }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.prevNext.bind(this, 'next') }
            />
            <Icon key={'next'} className="fa fa-arrow-up" style={ { height: '20px'} }
              onColor={ this.theme('hovers.text') }
              offColor={ this.theme('colors.text') }
              onClick={ this.prevNext.bind(this, 'prev') }
            />
          </div>
        </div>
      );
    }
  }

});
