var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

var styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex'
  }
};

core.Component('ui.Table', {
  propTypes: {
    columns: PropTypes.array,
    rows: PropTypes.array
  },
  getDefaultProps(){
    return {
      columns: [{
        "title": "one",
      },{
        "title": "two",
      },{
        "title": "three",
      }],
      rows: [{
        name: 'A',
        cells: ['A1', 'A2', 'A3']
      },{
        name: 'B',
        cells: ['B1', 'B2', 'B3']
      },{
        name: 'C',
        cells: ['C1', 'C2', 'C3']
      }]
    };
  },
  render: function() {
    var { columns, rows } = this.props;
    return (
      <div { ...this.props } style={{ ...styles.wrap, ...this.props.style }}>
        <div style={ styles.row }>
          {
            columns.map((col, i) => {
              var style = { flex: 1 };
              if(col.width){ style.maxWidth = col.width; }
              else if(col.flex){ style.flex = col.flex; }
              return <div key={ i } style={ style }>{ col.title }</div>
            })
          }
        </div>
        {
          rows.map((row, i) => {
            return (
              <div key={ i } style={ styles.row }>
                {
                  row.cells.map((cell, i) => {
                    var style = { flex: 1 };
                    var col = columns[i];
                    if(col){
                      if(col.width){ style.maxWidth = col.width; }
                      else if(col.flex){ style.flex = col.flex; }
                    }
                    return <div key={ i } style={ style }>{ cell }</div>
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
});
