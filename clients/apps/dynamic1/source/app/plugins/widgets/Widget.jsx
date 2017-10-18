

module.exports = {
    $_type: 'plugin',
    name: 'Widget',
    dependencies: [
    ],
    get(){

        var core = this;
        var { React, PropTypes } = core.imports;

        var ui = {
            Box(props){
                var { title, style, children, bodyStyle, headerStyle, badge, isLoading, collapsed, toggleCollapse } = props;
                var { Wrapper, Body, Header, Collapse, Title, Badge } = ui;

                return (
                    <Wrapper style={ style }>
                        <Header style={ headerStyle }>
                            <div style={{ display: 'flex' }}>
                                <Title>{ title }</Title>
                                <Badge badge={ badge } isLoading={ isLoading }/>
                            </div>
                            <Collapse collapsed={ collapsed } onClick={ toggleCollapse }/>
                        </Header>
                        <Body collapsed={ collapsed } style={ bodyStyle }>
                            { children }
                        </Body>
                    </Wrapper>
                );
            },
            Wrapper({ style, children, ...props }){

                return (
                    <div style={{
                            borderRadius: '3px',
                            background: '#fff',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0.1em',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                            ...style
                        }} { ...props }>

                        { children }

                    </div>
                );
            },
            Body({ collapsed, style, children, ...props }){

                if(collapsed) return null;
                return (
                    <div style={{
                            position: 'relative',
                            flex: 1,
                            minHeight: 240,
                            overflowY: 'auto',
                            ...style
                        }} { ...props }>

                        { children }

                    </div>
                );
            },
            Header({ style, children, ...props }) {

                return (
                    <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 40,
                                borderColor: core.theme('colors.border'),
                                ...style
                            }} { ...props }>

                        { children }

                    </div>
                );
            },

            Collapse({ collapsed, children, onClick, ...props }){

                return (
                        <div 
                            onClick={ onClick }
                            touch={true}
                            style={{ 
                                height: 40,
                                width: 40,
                                padding: 0,
                            }} { ...props }>
                            { collapsed ? "◀" : "▼" }
                        </div>
                );
            },

            Title({ children, style, ...props }){

                return (
                        <div style={{
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            fontSize: 13,
                            color: core.theme('colors.secondary'),
                            padding: '0 3px 0 15px',
                            ...style                               
                            }} { ...props }>
                            { children }
                        </div>
                );
            },

            Badge({ badge, isLoading, style, ...props }){

                return (
                        <div badge={ parseInt(badge) || 0 }
                            style={{
                                borderRadius: '3px',
                                minWidth: '25px',
                                height: '14px',
                                fontWeight: 'normal',
                                fontSize: '11px',
                                lineHeight: '14px',
                                transition: 'all .2s linear',
                                background: '#eee',
                                color: '#444',
                                ...style
                            }} { ...props }>
                        </div>
                );
            }
        };

        return {
            statics: ui,
            propTypes: {
                id: PropTypes.string,
                title: PropTypes.string,
                badge: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number
                ]),
                headerStyle: PropTypes.object,
                bodyStyle: PropTypes.object,
                isLoading: PropTypes.bool
            },

            getInitialState(){
                return {
                    collapsed: false
                }
            },

            getDefaultProps(){
                return {
                  title: 'Widget',
                  badge: 0,
                  isLoading: false
                }
            },

            toggleCollapse(){
                this.setState({
                    collapsed: !this.state.collapsed
                });
            },

            render(){
                var { id, component, children, ...props } = this.props;

                var widget = core.widget(id).get();
                component = (component || widget.component);

                if(core.isFunction(children) ){
                    return children(this, ui);
                }
                
                if(component){
                    var Component = core.components[component];
                    if(Component){
                        return <Component { ...props } widget={ widget } />
                    }
                }

                return (
                    <ui.Box
                        collapsed={ this.state.collapsed } 
                        toggleCollapse={ this.toggleCollapse }
                        { ...props }>

                        { children }
                        
                    </ui.Box>
                );
            }
        }
    }  
};


var widgetSchema = [
    {
        "key": "id",
        "description": "a unique id for the widget",
        "type": "string",
        "input": "text",
        "defaultValue": ""
    },{
        "key": "title",
        "description": "the title of the widget",
        "type": "string",
        "input": "text",
        "defaultValue": "Widget"
    },{
        "key": "description",
        "description": "a short description for the widget",
        "type": "string",
        "input": "textarea",
        "defaultValue": "No description"
    },{
        "key": "box",
        "description": "should the widget be wrapped in a collapsable box?",
        "type": "string",
        "input": {
            "type": "select",
            "options": ["box"],
        },
        "defaultValue": "box"
    }
];

