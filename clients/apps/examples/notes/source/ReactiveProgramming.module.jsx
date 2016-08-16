var core = require('core');

core.Component('ReactiveProgramming', ['ui.Box'], (Box)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20 }}>
          <h1>Reactive Programming</h1>
          <Box style={{ top: 100 }}>
              { this.props.children }
          </Box>
        </Box>
      );
    }
  };
})

core.Component('Streams', ['ui.Box'], (Box)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20 }}>
          <Box style={{ top: 100 }}>
              { this.props.children }
          </Box>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="images/river.jpg"/>
          </div>
          <h2 style={{ padding: '40px' }}>
            Streams are just a changing state
          </h2>
        </Box>
      );
    }
  };
});



core.Component('FunctionVsState', ['ui.Box', 'Line'], (Box, Line)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20, display: 'flex' }}>
          <div style={{ flex: 1, padding: 20 }}>
            <Line style={{ fontSize: '36px', padding: '20px 0' }}>functions</Line>
              <pre>
                <Line>
                  door.open();
                </Line>
                <Line>
                  door.close();
                </Line>
              </pre>
          </div>

          <div style={{ flex: 1, padding: 20 }}>
            <Line style={{ fontSize: '36px', padding: '20px 0' }}>state</Line>
              <pre>
                <Line>
                  door.isOpened = true;
                </Line>
                <Line>
                  door.isOpened = false;
                </Line>
              </pre>
          </div>

        </Box>
      );
    }
  };
});


core.Component('StateChange', ['ui.Box', 'Line'], (Box, Line)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20 }}>
          <Line style={{ fontSize: '36px', padding: '20px 0' }}>State change</Line>
          <Box style={{ top: 100 }}>
            { this.props.children }
          </Box>
        </Box>
      );
    }
  };
});

core.Component('StateChange1', ['ui.Box'], (Box)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20 }}>
          <img src="images/change.png" style={{ width: 600 }}/>
        </Box>
      );
    }
  };
});

core.Component('StateChange2', ['ui.Box'], (Box)=>{
  return {
    render(){
      return (
        <Box style={{ padding: 20 }}>
          <img src="images/change2.png" style={{ width: 600 }}/>
        </Box>
      );
    }
  };
});

core.Component('ReactiveLink', [''], ()=>{
  return {
    render(){
      return (
        <div style={{ padding: 40 }}>
          <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754" target="_black">Article on reactve streams</a>
        </div>
      );
    }
  };
})

core.Component('Line', [''], ()=>{
  return {
    render(){
      return (
        <div style={{ minHeight: '30px', lineHeight: '30px', ...this.props.style }}>
          { this.props.children }
        </div>
      );
    }
  };
})
