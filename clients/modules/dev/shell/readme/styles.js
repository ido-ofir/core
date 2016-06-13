
var box = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'auto'
};

module.exports = {
  box: box,
  wrapper: {
    position: 'absolute',
    right: 6,
    top: 6,
    zIndex: 100,
    display: 'flex'
  },
  btn: {
    minWidth: 26,
    minHeight: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ddd',
    borderRadius: '50%',
    cursor: 'pointer',
    margin: '4px',
    color: '#fff',
    transition: '0.4s ease',
    WebkitTransition: '0.4s ease'
  },
  textarea: {
    ...box,
    border: 0,
    padding: '40px 20px 20px 20px',
    width: '100%',
    outline: 'none'
  },
  link: {
    position: 'relative',
    padding: '10px'
  }
}
