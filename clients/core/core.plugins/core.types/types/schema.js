

module.exports = {
  name: 'schema',
  schema: [
    {
      key: 'key',
      type: 'string',
      description: 'the name of this property',
      input: 'text',
      required: true
    },{
      key: 'type',
      type: 'string',
      description: 'the native javascript type of this property',
      required: true,
      options: [
        'boolean',
        'string',
        'number',
        'array',
        'object'
      ],
      input: 'select',
      value: 'boolean'
    },{
      key: 'description',
      type: 'string',
      description: 'the description of this property',
      input: 'textarea',
      value: 'boolean'
    },{
      key: 'input',
      type: 'string',
      description: 'the input to use for editing this property in a GUI',
      input: 'select',
      options: [
        'text',
        'select',
        'number',
        'checkbox',
        'date'
      ],
      value: 'text'
    },{
      key: 'required',
      type: 'boolean',
      description: 'should this property be required?',
      input: 'checkbox',
      value: false
    },{
      key: 'options',
      type: 'array',
      description: 'available options for the value of this property',
      input: 'textarea',
      value: []
    },{
      key: 'value',
      type: 'any',
      description: 'initial value for this property',
      input: 'textarea',
      value: []
    }
  ],
  build(schema){
    

    return schema;
  }
};
