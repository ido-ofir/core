var core = require('core');

import React, { PropTypes as PT } from 'react';
import Radium from 'radium';
import cx from 'classnames';
import stripTags from 'striptags';

core.Component('ui.ShortText', ['webint.mixin'], (mixin) => {
  return {
    enhancers : [Radium],
    mixins : [mixin],
    propTypes : {
      trim : PT.number,
      fallback: PT.string,
      children : PT.string,
      className : PT.string,
      style : PT.object
    },

    format (content = '', fallback = '', trim) {
      let text = stripTags(content || fallback);

      if (trim && text.length >= trim)
        text = text.substring(0, trim - 3) + '...'

      return text;
    },

    render () {
      const { theme, props, format } = this
      const { children, className, fallback, trim } = props

      const textStyle = {
        fontFamily: theme('font'),
        color: theme('hovers.text'),
        fontSize: 11,
        marginBottom: 10
      }

      return (
      <div
        className={['ui-shorttext', className]}
        style={[textStyle, props.style]}>
        { format(children, fallback, trim) }
      </div>
      )
    }
  }
});
