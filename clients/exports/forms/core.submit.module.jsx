var React = require('react');
var PropTypes = React.PropTypes;

var core = require('core');
core.Component('core.Submit.Button', ['ui.Button'], (Button) => {
  return {
    propTypes: {
      type : PropTypes.oneOf(['primary', 'secondary', 'success', 'error']),
      size: PropTypes.oneOf(['small', 'large']),
      hollow: PropTypes.bool,
      isLoading: PropTypes.bool,
      disabled: PropTypes.bool
    },
    contextTypes: {
      form: PropTypes.object
    },
    getDefaultProps(){
      return {
        type: 'secondary',
        size: 'small',
        hollow: false,
        disabled: false
      }
    },
    onSubmit() {
      this.context.form.submit();
    },

    renderLoader() {
      return (!this.props.isLoading) ?
        null
      : (
          <div className="sm-sk-fading-circle" style={{marginLeft: 3}}>
            <div className="sk-circle1 sk-circle"></div>
            <div className="sk-circle2 sk-circle"></div>
            <div className="sk-circle3 sk-circle"></div>
            <div className="sk-circle4 sk-circle"></div>
            <div className="sk-circle5 sk-circle"></div>
            <div className="sk-circle6 sk-circle"></div>
            <div className="sk-circle7 sk-circle"></div>
            <div className="sk-circle8 sk-circle"></div>
            <div className="sk-circle9 sk-circle"></div>
            <div className="sk-circle10 sk-circle"></div>
            <div className="sk-circle11 sk-circle"></div>
            <div className="sk-circle12 sk-circle"></div>
          </div>
      );
    },

    ifSilent() {
      return !this.context.form.state.isValid || this.props.isLoading;
    },

    render() {
      return (
        <Button
          hollow={ this.props.hollow }
          type={ this.props.type }
          size={ this.props.size }
          style={ {...this.props.style} }
          onClick={this.onSubmit} disabled={this.ifSilent()}>
          <span>{this.props.children}</span>
          {this.renderLoader()}
        </Button>
      );
    }
  }
});
