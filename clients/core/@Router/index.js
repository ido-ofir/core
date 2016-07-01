
var React = require('react');
var PropTypes = React.PropTypes;

var pure = require('./pure.js');
var Route = require('./Route.js');

var Router = React.createClass({
  propTypes: {
    components: PropTypes.object,
    routes: PropTypes.array,
    defaultRoute: PropTypes.string,
    onNavigation: PropTypes.func
  },
  getInitialState(){
    window.router = this;
    return {
      route: null
    };
  },
  getDefaultProps(){
    return {
      defaultRoute: '/'
    };
  },
  onHashChange(){
    var hash = location.hash.substr(1);
    var queryStart = hash.indexOf('{');
    var name, urlArray, urlString, query, queryString;
    if(queryStart > -1){
      try{
        urlString = hash.slice(0, queryStart);
        queryString = hash.slice(queryStart);
        query = JSON.parse(queryString);
        Route.prototype.query = query;
      }
      catch(err){ console.error(err); return null; }
    }
    else{
      urlString = hash;
      Route.prototype.query = {};
    }
    urlArray = urlString.split('/').filter(n => n);
    var topRoute = {
      map: router.props.routes ? { children: router.props.routes } : null,
    };
    var route = new Route(urlArray, topRoute, router);
    if(!route.component){
      return (location.hash = this.props.defaultRoute);
    }
    this.setRoute(route);
  },
  setRoute(route){
    var hash = location.hash.substr(1);
    var newHash = pure.routeToUrl(route);
    if(newHash !== hash){  // fix url in address bar
      history.replaceState(null, null, '#' + newHash);
    }
    this.route = route;
    if(this.props.onNavigation) this.props.onNavigation(route);
    this.setState({ route: route });
  },
  toRoute(route, silent){
    // console.debug("route", route);
    if(silent){
      this.setRoute(route);
    }
    else{
      location.hash = pure.routeToUrl(route);
    }
  },
  setQuery(query, silent){
    var route = this.route;
    route.query = query;
    this.toRoute(route, silent);
  },

  componentDidMount(){
    window.addEventListener('hashchange', this.onHashChange);
    this.onHashChange();
  },
  componentWillUnmount(){
    window.removeEventListener('hashchange', this.onHashChange);
  },
  renderRoute(route, id){
    if(!route.name) return null;
    var component = pure.lookup(this.props.components, route.component);
    if(!component) return null;
    var children = route.children || [];
    var props = { key: id, route: route, ...route.query };
    return React.createElement(component, props, children.map((child, i)=>{
      return this.renderRoute(child, `${id}.${i}`);
    }));
  },
  render(){
    var route = this.route;
    if(!route) return null;
    return this.renderRoute(route, '0');
  }
});


Router.pure = pure;
module.exports = Router;
