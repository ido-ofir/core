var core = require('core');
var React = require('react');
var pt = React.PropTypes;
require('./list.scss');

var _ = require('lodash')

// Small helper for listening for an animation/transition end event.
function listenForEndEvent(el, endEventType, cb) {

    const onEnd = () => {
        cb();
        el.removeEventListener(endEventType, onEnd);
    };

    el.addEventListener(endEventType, onEnd);
}

core.Component('InboxList.Item', [], ()=>{
  return {
    propTypes: {
      item: pt.object,
      index: pt.number,
      style: pt.object,
      onOpen: pt.func,
      onClose: pt.func,
      renderSummaryTitle: pt.func,
      renderSummaryBody: pt.func,
      renderSummaryIcon: pt.func,
      renderSummaryContent: pt.func,
      renderTitle: pt.func,
      renderBody: pt.func,
      renderIcon: pt.func,
      keepSummaryContent: pt.bool
    },
    clean() {
        var message = this.refs.message;
        if(message){
          message.classList.remove('message--fixed');
          message.classList.remove('message--absolute');
        }
        return message;
    },

    open(){
      var { details, grower, message } = this.refs;
      message.classList.add('message--opening');

      // The grower should be the same height as the incoming details,
      // which are now displayed, but offscreen so we can still get the
      // height
      grower.style.height = `${details.offsetHeight}px`;

      // When the grower has stopped height-transitioning, we remove the
      // animation class and add the open class
      listenForEndEvent(grower, 'transitionend', () => {
          message.classList.remove('message--opening');
          message.classList.add('message--open');
      });
    },
    close(cb){
      var { details, grower, message } = this.refs;
      // Remove any open class and add the closing animation class
      message.classList.remove('message--open');
      message.classList.add('message--closing');
      console.log(5);

      // We're animating the grower out now, so we listen to the `animationend`
      // event.  After that, remove any style artifacts from other animations
      listenForEndEvent(grower, 'animationend', () => {
          message.classList.remove('message--closing');

          grower.removeAttribute('style');

          if (typeof cb === 'function') {
              cb();
          }
      });
    },

    onOpen(){
      this.props.onOpen(this);
    },
    onClose(){
      this.props.onClose(this);
    },

    getBounds(){
      return this.refs.message.getBoundingClientRect();
    },
    getHeaderOffsetHeight(){
      return this.refs.header.offsetHeight;
    },
    render(){
      var item = this.props.item;
      var i = this.props.index;
      return (
        <div className='message' ref='message'>
          <div className='message__summary' onClick={ this.onOpen }>
            <div className='message__summary__icon'>
              { this.props.renderSummaryIcon(item, i) }
            </div>
            <div className='message__summary__title'>{ this.props.renderSummaryTitle(item, i) }</div>
            <div className='message__summary__body'>{ this.props.renderSummaryBody(item, i) }</div>
          </div>
          <div className='grower' ref='grower'></div>
          <div className='message__details' ref='details'>
            <div className='pusher' ref='pusher'></div>
            <div className='message__details__header' ref='header' onClick={ this.onClose }>
              <div className='h1'>{ this.props.renderTitle(item, i) }</div>
            </div>
            <div className='message__details__body'>
              <div className='message__details__body__icon'>
                { this.props.renderIcon(item, i) }
              </div>
              <div className='message__details__body__content'>
                { this.props.renderBody(item, i) }
              </div>
            </div>
          </div>
          <div className='message__summary__content'>
            { this.props.renderSummaryContent(item, i) }
          </div>
        </div>
      );
    }
  };
});
