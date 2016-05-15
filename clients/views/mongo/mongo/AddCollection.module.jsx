var React = require('react');
var pr = React.PropTypes;
var core = require('core');

var options = ['string', 'number', 'object', 'array'];
var Input = require('./Input.jsx');
core.Component('mongo.AddCollection', ['ui.Icon','ui.Button','forms'], (Icon, Button, forms)=>{

  var data = { name: '', schema: { name: 'string'}};
  return {
    addCollection(data){
      this.refs.form.reset();
      core.action("mongo.addCollection", data.name);
    },
    render(){
      return (
        <forms.Form ref="form"
                    data={ data }
                    onSubmit={ this.addCollection }
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}>
            <Input name="name" placeholder="Name" inputStyle={{marginBottom: 0}} onEnterKey={ ()=>{ this.refs.form.submit() } }/>

            <Icon className="fa fa-plus" size="20px" style={{ marginLeft: 15 }} onClick={ ()=>{ this.refs.form.submit() } }/>

        </forms.Form>
      );
    }
  };
});
