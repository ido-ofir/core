

require('core').Module('ui', [
  'ui.Select',
  'ui.TextArea',
  'ui.ListItem',
  'ui.Json',
  'ui.Input',
  'ui.Icon',
  'ui.Card',
  'ui.Button',
  'ui.Box',
  'ui.Loader',
  'ui.CheckBox',
  'ui.Pre'
], (Select, TextArea, ListItem, Json, Input, Icon,
    Card, Button, Box, Loader, CheckBox, Pre)=>{
  return {
    Select: Select,
    TextArea: TextArea,
    ListItem: ListItem,
    Json: Json,
    Input: Input,
    Icon: Icon,
    Card: Card,
    Button: Button,
    Box: Box,
    Loader: Loader,
    CheckBox: CheckBox,
    Pre: Pre
  };
});
