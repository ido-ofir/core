

require('core').Module('ui', ['ui.CloseBtn', 'ui.Header'], (CloseBtn, Header)=>{
  return {
    CloseBtn: CloseBtn,
    Header: Header
  };
});
