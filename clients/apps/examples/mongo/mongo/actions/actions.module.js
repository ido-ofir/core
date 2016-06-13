var core = require('core');

core.Action('mongo.error', ['mongo.tree'], (tree)=>{

  // tree.on('write', function(e) {
  //   console.log('Affected path:', e.data.path);
  // });

  return (err)=>{
    console.error(err);
    if(err && err.name){
      var msg = `${err.name} - ${err.message}`;
      alert(msg);
    }
  };
});
