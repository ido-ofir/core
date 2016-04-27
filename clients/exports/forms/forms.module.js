var core = require('core');

core.Module('forms', [], ()=>{
  return {
    Form: require('./Form.jsx'),
    Input: require('./Input.jsx'),
    Submit: require('./Submit.jsx'),
    CheckBox: require('./CheckBox.jsx'),
    FileInput: require('./FileInput.jsx'),
    RadioGroup: require('./RadioGroup.jsx'),
    SmartSelect: require('./SmartSelect'),
    DatePicker: require('./DatePicker'),
    GapDatePickers: require('./GapDatePickers/GapDatePickers.jsx'),
    ResponsiveButton: require('./ResponsiveButton.jsx'),
    mixins: require('./mixins')
  };
});
