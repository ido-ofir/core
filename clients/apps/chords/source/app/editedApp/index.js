
var core = require('core');
var source =
`
({
    name: 'yo',
    get(){

        return ()=>{
            alert(55);
        };

    }
});
`
var compiled =
`
(function(){
return {
name: 'yo',
get: function(){

return function(){
  alert(333);
};

}
};
}())
`;
module.exports = core.App({
  name: 'test',
  tree: {},
  components: [],
  modules: [],
  actions: [{
    $_type: 'code',
    name: 'yo',
    source: source,
    compiled: compiled
  }],
  views: [],
  templates: [],
});
