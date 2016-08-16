var core = require('core');

core.require(['socket'], (socket)=>{

  const update = (data)=>{
    core.tree.set(['targetSource'].concat(data.path), data.value);
  };

  const initApps = (apps) => {
    core.tree.set('apps', apps);
    core.tree.set('selectedAppPath', apps[0]);
    if(apps[0]){
      core.run('getSource', { appPath: apps[0] });
    }
  };

  core.Action('initialize', ()=>{

    socket.run('getApps').then(initApps);
    socket.off('update', update);
    socket.on('update', update);

  });

  // socket.whenOpened(n => core.run('initialize'))

});
