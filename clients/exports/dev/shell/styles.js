var styles = {

  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto'
  },
  wrapper: {
    position: 'absolute',
    right: 14,
    bottom: 14,
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
  webpackError: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    background: 'rgba(250,50,50,0.8)',
    color: '#800',
    zIndex: 99,
    padding: '20%'
  }
}

module.exports = styles;
