var core = require('core');

var colors = {
  'undefined': '#ffe8c2',
  'null': '#fddb72',
  'boolean': '#29b5a5',
  'string': '#80c7de',
  'number': '#e64f4f',
  'array': '#009000',
  'object': '#4f2d52'
};


const symbolStyle = {
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  minWidth: 24,
  marginLeft: '6px'
};

const plusMinusStyle = {
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  minWidth: 24,
  marginLeft: '6px'
};

const objectSymbol = {
  ...symbolStyle,
  color: colors.object
}

const arraySymbol = {
  ...symbolStyle,
  color: colors.array
}

const promitiveStyle = {
  width: 16,
  height: 16,
  borderRadius: '50%'
};

const Plus = props => <span style={ plusMinusStyle } { ...props }>
  <span>{ props.nested ? '-' : null }</span>
</span>;

const Minus = props => <span style={ plusMinusStyle } { ...props }>
  <span>{ props.nested ? '+' : null }</span>
</span>;

const ClosedObject = props => <span style={ objectSymbol } { ...props }>
  <span>{  `{` }</span>
  <span>{ props.children }</span>
  <span>{ `}` }</span>
</span>;

const ClosedArray = props => <span style={ arraySymbol } { ...props }>
  <span>{  `[` }</span>
  <span>{ props.children }</span>
  <span>{ `]` }</span>
</span>;

const Primitive = props => <span style={{ ...symbolStyle, justifyContent: 'center' }} { ...props }>
  <span style={{ ...promitiveStyle, background: colors[core.typeOf(props.value)] }}></span>
</span>;

var Property = core.Component('Property', {
  propTypes: {
    path: 'array!',
    value: 'any',
    initialyOpen: 'bool',
    isLast: 'bool'
  },
  bindings: {
    'selectedPath': ['target', 'path']
  },
  getInitialState(){
    return {
      isOpen: this.props.initialyOpen || false
    };
  },
  open(){ this.setState({ isOpen: true }); },
  close(){ this.setState({ isOpen: false }); },
  select(){
    var { path, value } = this.props;
    core.tree.set('target', {path: path, value: value});
  },
  render(){
    var { path, value, isLast } = this.props;
    var keys, name = path[path.length - 1];
    var selected = core.utils.equals(path, this.state.selectedPath);

    var length;
    if(this.state.isOpen){
      if(core.isObject(value)){
        keys = Object.keys(value);
        length = keys.length;
        return (
          <div style={{ padding: '4px 10px', background: (selected ? '#eee' : 'transparent') }}>
            <div style={{ display: 'flex' }}>
              <Plus onClick={ this.close } nested={ length !== 0 }/>
              <span onClick={ this.select } style={{ cursor: 'pointer'}}>
                { name }
                <span style={{ color: colors.object, marginLeft: '6px' }}>{ `{` }</span>
              </span>
            </div>
            <div style={{ paddingLeft: 24 }}>
              {
                keys.map((key, i) =>
                  <Property key={ key } isLast={ i === length -1 } path={ path.concat([key]) } value={ value[key] }/>
                )
              }
              <div style={{ color: colors.object }}>{ `}${ isLast ? '' : ','}` }</div>
            </div>
          </div>
        );
      }
      else if(core.isArray(value)){
        length = value.length;
        return (
          <div style={{ padding: '4px 10px', background: (selected ? '#eee' : 'transparent') }}>

            <div style={{ display: 'flex' }}>
              <Plus onClick={ this.close } nested={ length !== 0 }/>
                <span onClick={ this.select } style={{ cursor: 'pointer'}}>
                  { name }
                  <span style={{ color: colors.array, marginLeft: '6px' }}>{ `[` }</span>
                </span>
            </div>
            <div style={{ paddingLeft: 24 }}>
              {
                value.map((item, i) =>
                  <Property key={ i } isLast={ i === length -1 } path={ path.concat([i]) } value={ item }/>
                )
              }
              <div style={{ color: colors.array }}>{ `]${ isLast ? '' : ','}` }</div>
            </div>
          </div>
        );
      }
    }
    else{
      if(core.isObject(value)){
        keys = Object.keys(value);
        length = keys.length;
        return (
          <div style={{ padding: '4px 10px', background: (selected ? '#eee' : 'transparent') }}>
            <div style={{ display: 'flex' }}>
              <Minus onClick={ this.open } nested={ length !== 0 }/>
              <span onClick={ this.select } style={{ cursor: 'pointer'}}>
                { name }
              </span>
              <ClosedObject>{ length }</ClosedObject>
              { isLast ? '' : ',' }
            </div>
          </div>
        );
      }
      else if(core.isArray(value)){
        length = value.length;
        return (
          <div style={{ padding: '4px 10px', background: (selected ? '#eee' : 'transparent') }}>
            <div style={{ display: 'flex' }}>
              <Minus onClick={ this.open } nested={ length !== 0 }/>
              <span onClick={ this.select } style={{ cursor: 'pointer'}}>
                { name }
              </span>
              <ClosedArray>{ length }</ClosedArray>
              { isLast ? '' : ',' }
            </div>
          </div>
        );
      }
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', background: (selected ? '#eee' : 'transparent') }} value={ value }>
        <Primitive value={ value }/>
          <span onClick={ this.select } style={{ cursor: 'pointer'}}>
            { name }
          </span>
      </div>
    );
  }
});
