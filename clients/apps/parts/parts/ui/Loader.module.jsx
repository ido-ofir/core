
var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

core.Component('Parts.Loader', ['ui.Loader'], (Loader)=>{



  return {
    getInitialState(){
      return { value: '' };
    },
    render(){

      return (
        <div>
          <h3>ui.Loader</h3>
            <ul>
              <li><b>type</b> - 1, 2, 3.. loader types</li>
              <li><b>background</b> - background of the loader, defaults to '#fff'</li>
              <li><b>opacity</b> - amount of opacity, defaults to 0.5</li>
            </ul>
            <pre style={{ display: 'flex' }}>
              { `<Loader type={ 1 }/>` }
            </pre>
            <div style={{ minHeight: 100, border: '1px solid #ddd', position: 'relative', marginBottom: 10}}>
                <Loader type={ 1 } />
            </div>
            <pre style={{ display: 'flex' }}>
              { `<Loader type={ 2 } opacity={ 1 }/>` }
            </pre>
            <div style={{ minHeight: 100, border: '1px solid #ddd', position: 'relative', marginBottom: 10}}>
                <Loader type={ 2 } opacity={ 1 }/>
            </div>
            <pre style={{ display: 'flex' }}>
              { `<Loader type={ 3 } background="red"/>` }
            </pre>
            <div style={{ minHeight: 100, border: '1px solid #ddd', position: 'relative', marginBottom: 10}}>
                <Loader type={ 3 } background="red"/>
            </div>
        </div>
      );
    }
  };
});
