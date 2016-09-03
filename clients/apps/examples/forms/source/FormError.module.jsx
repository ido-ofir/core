var core = require('core');

core.Component('FormError', props =>
  <div { ...props } style={{
      height: 20,
      lineHeight: '20px',
      fontSize: '12px',
      color: core.theme('colors.error'),
      ...props.style
    }}>
    { props.children }
  </div>
);
