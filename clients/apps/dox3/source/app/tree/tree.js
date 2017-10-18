
module.exports = {
  source: {},
  
  structure: {
    $_type: 'array',
    items: [{
      name: 'plugins',
      builder: 'Plugin'
    },{
      name: 'modules',
      builder: 'Module'
    },{
      name: 'components',
      builder: 'Component'
    },{
      name: 'views',
      builder: 'View'
    },{
      name: 'templates',
      builder: 'Template'
    },{
      name: 'actions',
      builder: 'Action'
    }]
  }
};
