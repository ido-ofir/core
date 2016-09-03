var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');
var moment = require('moment');
var _ = require('lodash');


var styles = {
  info: {
    display:'flex',
    flexDirection:'column',
    margin: '0 0 0 15px',
    height: 'auto',
    width: '100%'
  },
  progress: {

    // width: '90%',
    position: 'relative',
    height: '7px',
    margin: 0
  },
  infobox: {
    borderBottom: '1px solid #ddd',
    padding: 15,
    position:'relative'
  }
};

core.Component('Document.Viewer.Doc',
  ['webint.mixin',
   'layout',
   'Document.Viewer.Bar',
   'Widget.Box',
   'Select.Box.Button',
   'Loader',
   'ui.Icon',
   'ui.Scroll'],
  (mixin, layout, DocBar, WidgetBox, SelectButton, Loader, Icon, Scroll) => {

  return {
    mixins: [mixin],

    componentDidMount(){
      window.pdf = this.refs.iframe;
    },

    render() {

      return (
        <WidgetBox key={ 'Document' } noHeader={ true } title={ 'Document' } style={ styles.info } key={'info'}>
          <DocBar numPages={ 5 } currentPage={ 1 } />
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0 }}>
            <iframe id="documentViewerIframe" ref="iframe" src="http://localhost:4000/resources/files/pdf.html" style={{ width: '100%', height: '100%'}}></iframe>
          </div>
        </WidgetBox>
      );
    }
  }

});
