require('core').Module('layout', [], ()=>{
  return {
    flexAlignHor: {
      display: 'flex',
      justifyContent: 'center',
    },
    flexAlignVert: {
      display: 'flex',
      alignItems: 'center'
    },
    flexCol: {
      display: 'flex',
      flexDirection: 'column'
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row'
    },
    spaceBetween: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    spaceAround: {
      display: 'flex',
      justifyContent: 'space-around'
    },
  };
});
