import React from 'react';
import core from 'core';
import cx from 'classnames';
import Radium from 'radium';


let spreadStyles = { position : 'absolute', left: 0, top: 0, right: 0, bottom: 0 }

const DEBUG = 0

const Grid = (props, context = {}) => {
  let {
    children,
    className,
    direction,
    style,
    grow,
    spread,
    ...rest
  } = props;

  let config = (() => {
    const { grow } = context; return { grow }
  })()

  style = {
    display : 'flex',
    flexDirection : direction || 'column',
    flexGrow : config.grow || grow,
    ...(spread && spreadStyles),
    ...context.style,
    ...style,
    ...(DEBUG && { outline : '1px solid gold'})
  }

  return (
    <div className={ cx('layout-grid', className) } { ...{rest, style} } >
      { children }
    </div>
  )
}

const Row = (props, context = {}) => {
  let {
    children,
    className,
    alignItems,
    grow,
    style,
    centerX, centerY, center,
    ...rest
  } = props;

 if (center) {
    centerX = true
    centerY = true
  }
 
  style = {
    display : 'flex',
    flexGrow : grow,
    alignItems,
    ...context.style,
    ...style,
    ...(DEBUG && { outline : '1px solid green'})
  }

  style = {
    ...style,
    ...(centerX && { justifyContent : 'center' }),
    ...(centerY && { alignItems : 'center' }),
  }

  return (
    <div className={ cx('layout-row', context.className, className) } { ...{rest, style} } >
      { children }
    </div>
  )
}

const Col = (props, context = {}) => {
  let {
    children,
    className,
    grow = 1,
    alignItems,
    justifyContent = 'initial',
    style,
    shrink,
    centerX, centerY, center,
    ...rest
  } = props;

  if (center) {
    centerX = true
    centerY = true
  }

  let config = (() => {
    const { grow } = context; return { grow }
  })()

  style = {
    flexGrow : shrink ? 0 : (grow || config.grow),
    ...context.style,
    ...style,
    ...(DEBUG && { outline : '1px solid blue'})
  }

  if (alignItems || justifyContent) {
    style = {
      ...style,
      display : 'flex',
      alignItems,
      justifyContent
    }
  }

  style = {
    ...style,
    ...(centerX && { justifyContent : 'center' }),
    ...(centerY && { alignItems : 'center' }),
  }

  return (
    <div className={ cx('layout-col', className) } { ...{rest, style} } >
      { children }
    </div>
  )
}



core.Module('layout.flexbox', [], () => {
  return { Row, Col, Grid }
})
