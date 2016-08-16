var core = require('core');

core.require(['socket'], (socket)=>{

  core.Action('getSource', { appPath: 'string!' }, (params)=>{

    socket.run('get', params).then(source => {

      core.tree.set('targetSource', source);
      core.tree.set('selectedAppPath', params.appPath);
      core.tree.set('target', {path: [], value: source});

    });

  });

});
