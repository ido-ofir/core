
var core = require('core');
var q = require('q');

module.exports = {
  name: 'client',
  dependencies: ['Client'],
  get(Client){

    var app = this;
    var url = app.get('apiUrl');
    var client = {
      authToken: '',
      run(action, data, promise){
        if(!data) { data = {}; }
        var defered = promise || q.defer();
        var body = JSON.stringify(data);
        var req = fetch(`${url}/${action}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authtoken': this.authToken
          },
          body: body
        });
        req.then((res) => res.json()).then((data)=>{
          // console.log('data', data);
          defered.resolve(data);
        }).catch((err)=>{
          // console.log('err', err);
          defered.reject(err);
        });
        return defered.promise;
      },
      login(data){
        var defered = q.defer();
        // console.log('logging in ', data);
        this.run('login', data).then((data) => {
          this.authToken = data.token;
          this.isAuthorized = true;
          defered.resolve(data.user);
        }).catch((err)=>{
          this.authToken = '';
          defered.reject(err);
        });
        return defered.promise;
      },
      authorize(data){
        return this.login(data)
      },
      signOut(){
        var defered = q.defer();
        // console.log('logging in ', data);
        this.authToken = '';
        this.isAuthorized = false;
        this.run('signOut').then((data) => {
          defered.resolve(data.user);
        }).catch((err)=>{
          defered.reject(err);
        });
        return defered.promise;
      }
    };
    return client;
  }
};


/*
module.exports = {
  name: 'client',
  dependencies: ['Client'],
  get(Client){

    var app = this;

    var client = core.client = new Client({
      log: false,
      url: this.get('socketUrl'),
      onOpen(){
        // Alert.alert('socket connected');
        console.log('socket connected!!');
        app.run('getUsers');
        // client.run('ok').then(d => );
      },
      onClose(){
        console.log('socket disconnected');
      }
    });
    return client;
  }
};

*/
