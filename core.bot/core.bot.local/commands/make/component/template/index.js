
import React from 'react';
import pt from 'prop-types';

module.exports = {
    name: "<% name %>",
    description: '',
    propTypes: [{
        key: 'name',
        type: 'string',
        input: 'text',
        value: 'unnamed'
    }],
    dependencies: [],    
    get() {
        
        var core = this;

        var { React, PropTypes } = core.imports;

        return {
            propsTypes: {
                // title: pt.string
            },
            getDefaultProps(){
                return {

                };
            },
            getInitialState() {

                return {

                };
            },
            componentDidMount() {

            },
            componentWillUnmount() {

            },
            render() {

                return (
                    <div>
                        <% name %>
                    </div>
                )
            }            
        }
    }
}