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
        <Box style={{ padding: 20 }}>
          <Line style={{ fontSize: '26px', padding: '20px 0' }}>is there a difference between this:</Line>
          <pre style={{ width: 600 }}>
            <Line>
              door.open();
            </Line>
            <Line>
              door.close();
            </Line>
          </pre>
          <Line style={{ fontSize: '26px', padding: '20px 0' }}>and this:</Line>
          <pre style={{ width: 600 }}>
            <Line>
              door.isOpened = true;
            </Line>
            <Line>
              door.isOpened = false;
            </Line>
          </pre>
          <Line style={{ fontSize: '26px', padding: '20px 0' }}>?</Line>
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
