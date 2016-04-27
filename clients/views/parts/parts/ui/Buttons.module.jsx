
var React = require('react');
var ReactDom = require('react-dom');
var core = require('core');

var styles = {
  part: {
    padding: 15
  },
  row: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 15
  }
};

core.Component('Parts.Buttons', ['ui.Button'], (Button)=>{

  return {
    render(){
      return (<div>
        <h2>UI</h2>
        <div style={ styles.part }>
          <h3>ui.Button</h3>
          <ul>
            <li><b>type</b> - one of : 'primary', 'secondary', 'success', 'error'. defaults to 'primary'</li>
            <li><b>size</b> - one of : 'small', 'large'. defaults to 'large'</li>
            <li><b>disabled</b> - boolean, defaults to false</li>
            <li><b>hollow</b> - boolean, defaults to false</li>
            <li><b>style</b> - will merge and override the style of the element</li>
          </ul>

          <pre style={{ display: 'flex' }}>
            { `<Button type="primary">Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary">Primary</Button>
            <Button type="secondary">Secondary</Button>
            <Button type="success">Success</Button>
            <Button type="error">Error</Button>
          </div>
          <pre style={{ display: 'flex' }}>
            { `<Button type="primary" hollow={ true }>Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary" hollow={ true }>Primary</Button>
            <Button type="secondary" hollow={ true }>Secondary</Button>
            <Button type="success" hollow={ true }>Success</Button>
            <Button type="error" hollow={ true }>Error</Button>
          </div>
          <pre style={{ display: 'flex' }}>
            { `<Button type="primary" disabled={ true }>Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary" disabled={ true }>Primary</Button>
            <Button type="secondary" disabled={ true }>Secondary</Button>
            <Button type="success" disabled={ true }>Success</Button>
            <Button type="error" disabled={ true }>Error</Button>
          </div>
          <pre style={{ display: 'flex' }}>
            { `<Button type="primary" size="small">Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary" size="small">Primary</Button>
            <Button type="secondary" size="small">Secondary</Button>
            <Button type="success" size="small">Success</Button>
            <Button type="error" size="small">Error</Button>
          </div>
          <pre style={{ display: 'flex' }}>
            { `<Button type="primary" hollow={ true } size="small">Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary" size="small" hollow={ true }>Primary</Button>
            <Button type="secondary" size="small" hollow={ true }>Secondary</Button>
            <Button type="success" size="small" hollow={ true }>Success</Button>
            <Button type="error" size="small" hollow={ true }>Error</Button>
          </div>
          <pre style={{ display: 'flex' }}>
            { `<Button type="primary" size="small" disabled={ true }>Primary</Button>` }
          </pre>
          <div style={ styles.row }>
            <Button type="primary" size="small" disabled={ true }>Primary</Button>
            <Button type="secondary" size="small" disabled={ true }>Secondary</Button>
            <Button type="success" size="small" disabled={ true }>Success</Button>
            <Button type="error" size="small" disabled={ true }>Error</Button>
          </div>
        </div>
      </div>);
    }
  };
});
