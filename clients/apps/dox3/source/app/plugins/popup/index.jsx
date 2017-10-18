
var React = require('react');
var pt = React.PropTypes;

module.exports = {
    $_type: 'plugin',
    name: 'popup',
    recursive: true,
    state: {
      isOpen: false,
      content: null
    },
    open(content){
        this.content = content;
        this.set('isOpen', true);
    },
    close(){
        this.content = null;
        this.set('isOpen', false);
    },
    render(){
        var Popup = this.components['popup.Popup'];
        return <Popup/>
    },
    Popup: {
        $_type: 'component',
        name: 'popup.Popup',
        get(){
            
            var app = this;

            return {
                render(){
                    return this.app.bind(['plugins', 'popup'], state => {
                        if(!state.isOpen) return null;
                        var plugin = app.plugins.popup;
                        return (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)' }}></div>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div>
                                        { plugin.content }
                                    </div>
                                </div>
                            </div>
                        );
                    });
                }
            }
        }
    }
};