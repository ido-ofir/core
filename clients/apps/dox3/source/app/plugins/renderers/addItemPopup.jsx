
var React = require('react');

module.exports = {
    $_type: 'component',
    name: 'addItemPopup',
    get(){
        var app = this;

        return {
            propTypes: {
                type: 'object',
                map: 'object',
                onDone: 'func',
            },
            render(){
                var Fields = app.components['renderers.fields'];
                var { type, map } = this.props; 
                return (
                    <div style={{ background: '#fff', minWidth: 400, minHeight: 120, position: 'relative' }}>
                        <div onClick={ this.props.onDone } style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, cursor: 'pointer' }}>X</div>
                        <Fields source={ type.schema } map={ map }/>
                    </div>
                );
            }
        };
    }
};