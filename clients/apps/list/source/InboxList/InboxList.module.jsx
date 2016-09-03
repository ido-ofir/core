var core = require('core');
var React = require('react');
var pt = React.PropTypes;
require('./list.scss');

var _ = require('lodash');

core.Component('InboxList', ['InboxList.Item'], (Item)=>{

  return {
    propTypes: {
      items: pt.array.isRequired,
      style: pt.object,
      listStyle: pt.object,
      renderSummaryTitle: pt.func,
      renderSummaryBody: pt.func,
      renderSummaryIcon: pt.func,
      renderSummaryContent: pt.func,
      renderTitle: pt.func,
      renderBody: pt.func,
      renderIcon: pt.func,
      keepSummaryContent: pt.bool
    },
    getDefaultProps(){
      return {
        renderSummaryTitle(item, index){
          return (
            <span>The Title { index }</span>
          );
        },
        renderSummaryBody(item, index){
          return (
            <span>The body { index }</span>
          );
        },
        renderSummaryIcon(item, index){
          return (
            <div className='icon'></div>
          );
        },
        renderSummaryContent(){
          return null;
        },
        renderTitle(item, index){
          return (
            <span>The Title { index }</span>
          );
        },
        renderBody(item, index){
          return (
            <div>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>
            </div>
          );
        },
        renderIcon(item, index){
          return (
            <div className='icon'></div>
          );
        },
        keepSummaryContent: true
      };
    },
    getInitialState(){
      return {
        openedItem: null,
        openedIndex: -1
      };
    },
    componentDidMount(){
      var wrapper = this.refs.wrapper;
      var component = this;
      const { throttle } = _;

      this.onScrollThrottled = throttle(this.onScroll);
    },

    componentWillReceiveProps(newProps){
      if(newProps.items !== this.props.items){

      }
    },
    onScroll(){
      var instance = this.state.openedItem;
      if(!instance) return;
      var { top, bottom, width } = instance.getBounds();
      var height = instance.getHeaderOffsetHeight();

      var shouldBeSticky = top < 0 && bottom - height > 0;
      var shouldBeAbsolute = bottom - height <= 0;

      if (shouldBeSticky) {
          this.openHeader();
      }
      else {
        this.closeHeader();
      }
    },
    openHeader(){
      if(this.refs.fixedHeader){
        if(!this.fixedHeaderIsOpen){
          this.refs.fixedHeader.classList.add('opened');
          this.fixedHeaderIsOpen = true;
        }
      }
    },
    closeHeader(){
      if(this.refs.fixedHeader){
        if(this.fixedHeaderIsOpen){
          this.refs.fixedHeader.classList.remove('opened');
          this.fixedHeaderIsOpen = false;
        }
      }
    },
    openItem(instance){
      if(this.state.openedItem){
        this.state.openedItem.close(()=>{
          this.setState({
            openedItem: instance
          });
          instance.open();
        });
      }
      else{
        this.setState({
          openedItem: instance
        });
        instance.open();
      }
    },
    closeItem(instance){
      instance.close();
      this.setState({
        openedItem: null
      });
    },
    renderItem(item, i){
      var props = this.props;
      return (
        <Item key={ i }
              item={ item }
              index={ i }
              onOpen={ this.openItem }
              onClose={ this.closeItem }
              renderSummaryTitle={ props.renderSummaryTitle }
              renderSummaryBody={ props.renderSummaryBody }
              renderSummaryIcon={ props.renderSummaryIcon }
              renderSummaryContent={ props.renderSummaryContent }
              renderTitle={ props.renderTitle }
              renderBody={ props.renderBody }
              renderIcon={ props.renderIcon }
              keepSummaryContent={ props.keepSummaryContent }/>
      );
    },
    renderSummaryContent(item, i){
      var isOpen = (this.state.openedIndex === i);
      if(isOpen){
        if(!this.props.keepSummaryContent){
          return null;
        }
      }
      return this.props.renderSummaryContent(item, i);
    },
    renderFixedHeader(){
      var item = this.state.openedItem;
      var index = this.state.openedIndex;
      if(!item) return null;
      return (
        <div className='message__summary'>
          <div className='message__summary__icon'>
            { this.props.renderSummaryIcon(item, index) }
          </div>
          <div className='message__summary__title'>{ this.props.renderSummaryTitle(item, index) }</div>
          <div className='message__summary__body'>{ this.props.renderSummaryBody(item, index) }</div>
        </div>
      );
    },
    render(){
      return (
        <div className='inbox-list' style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', ...this.props.style }}>
          <div ref='wrapper' onScroll={ this.onScrollThrottled } style={{ maxHeight: '100%', overflowY: 'auto', padding: '24px', ...this.props.listStyle }}>
          { this.props.items.map(this.renderItem) }
          </div>
          <div className='fixed-header' ref="fixedHeader">
            { this.renderFixedHeader() }
          </div>
        </div>
      );
    }
  }

});
