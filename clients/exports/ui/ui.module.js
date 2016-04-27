

require('core').Module('ui', ['ui.CloseBtn', 'ui.Header'], (CloseBtn, Header)=>{
  return {
    CloseBtn: CloseBtn,
    Header: Header,
    inputs: {
      borderRadius: "3px !important",
      width: "100%",
      maxWidth: "100%",
      minHeight: "40px",
      maxHeight: "60px",
      height: "100%",
      margin: "0 auto"
    },
    textarea: {
      width: "100%",
      margin: "0 auto",
      borderRadius: "3px !important",
      maxWidth: "100%",
      resize: "vertical",
      height: "200px",
      minHeight: "100px"
    },
    popup: {
      width: "240px",
      height: "55px",
      position: "absolute",
      bottom: 20,
      left: 20,
      zIndex: 2,
      transform: "translateX(-270px)",
      WebkitTransform: "translateX(-270px)",
      transition: "transform 0.25s ease",
      WebkitTransition: "-webkit-transform 0.25s ease"
    },
    tabs: {
      active: {
        borderBottom:'1px solid #333',
        color:'#333'
      },
      normal: {
        border:'none',
        color:'#bbb'
      }
    },
    overlay: {
      background: "#000",
      opacity: "0.5"
    },

    wizard: {
      "header": {
        "width": "100%",
        "height": "60px",
        "padding": "15px",
        "position": "relative"
      },

      "progress": {
        "minWidth": "25%",
        "padding": "45px 40px"
      },

      "stepNumber": {
        "height": 40,
        "width": 40,
        "borderRadius": "50%",
        "borderWidth": "3px",
        "zIndex": "1",
        "fontWeight": "700",
        "color": "#999999"
      },
      "main": {
        "minWidth": "75%",
        "padding": "45px 115px",
        "height": "100%"
      }
    }
  };
});
