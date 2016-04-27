
module.exports = function(name, route, router){
  router.route(`/${name}/`)
    .get(function(req, res) {
      route.find(req.query, req.user, res.callback);
    })
    .post(function(req, res) {                                            // POST { name: 'koko'} => '/myCollection'   - create item
      route.create(req.body, req.user, res.callback);
    });

  router.route(`/${name}/:id`)
    .get(function(req, res) {
      route.find(req.params, req.user, res.callback);
    })
    .put(function(req, res) {
      route.update({
        target: req.params,
        update: req.body
      }, req.user, res.callback);                                           // PUT { expired: true } => '/myCollection/55'  - update item by id
    })
    .delete(function(req, res) {                                           // DELETE '/myCollection/55'  - delete item by id
      route.delete(req.params, req.user, res.callback);
    });
}
