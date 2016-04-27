import React from 'react';
import core from 'core';
import Radium from 'radium';
import styler from 'react-styling';

import moment from 'moment';

core.Component('ui.ScheduledDate', [], () => {

  return {
    enhancers : [Radium],
    render () {
      const { date } = this.props

      let inlineStyles = {
        dueDate : {},
        icon : {}
      }

      var dueDate = new Date(date);
      var text= this.translate('due date', 'Due date') + ' ' + moment(dueDate).fromNow();

      if (dueDate < moment()) {
        inlineStyles.dueDate.color = 'red';
        inlineStyles.icon.color = 'red';
        text = 'Due date past ' + moment(dueDate).fromNow()
      }

      return (
        <div className="case-due-date-box" style={[styles.box, inlineStyles.dueDateBox]}>
          <i className="case-due-icon glyphicon glyphicon-dashboard" style={[styles.icon, inlineStyles.icon]}/>
          <span className="case-due-text" style= {[styles.text, inlineStyles.dueDate]}>{text}</span>
        </div>
      )
    }
  }
})


const styles = styler `
  box
    display: flex
    flex-direction: row
    flex: 1
    align-items: center
    font-size: 11px
    color: green

    line-height: 1em

  icon
    font-size: 13px
    margin-right: 4px
    color: green

  text
    font-size: 11px
`
