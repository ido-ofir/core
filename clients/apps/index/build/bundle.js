webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi app\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_app?");

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\nvar core = __webpack_require__(39);\nvar ReactDom = __webpack_require__(92);\n\ncore.loadContext('index', __webpack_require__(222));\n\ncore.require(['Index'], function (Index) {\n  ReactDom.render(React.createElement(Index, null), document.getElementById('app'));\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/init.jsx\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/init.jsx?");

/***/ },

/***/ 222:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./Index.module.jsx\": 223,\n\t\"./View.module.jsx\": 224\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 222;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app .*\\.module\\.js\n ** module id = 222\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app_.*\\.module\\.js?");

/***/ },

/***/ 223:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\n\nvar core = __webpack_require__(39);\n\ncore.Component('Index', ['core.App', 'View'], function (App, View) {\n  return {\n    getInitialState: function getInitialState() {\n      return {\n        apps: {}\n      };\n    },\n    componentDidMount: function componentDidMount() {\n      var _this = this;\n\n      core.connection.action('shell.apps.getApps', function (apps) {\n        _this.setState({\n          apps: apps\n        });\n      });\n    },\n    renderView: function renderView(view, index) {\n      if (view.key === 'index') return;\n      return React.createElement(View, { key: index, view: view, path: '/' + view.key });\n    },\n    renderApps: function renderApps(apps) {\n      var array = Object.keys(apps).map(function (v) {\n        return { key: v, value: apps[v] };\n      });\n      return array.map(this.renderView);\n    },\n    render: function render() {\n      return React.createElement(\n        App,\n        { style: { padding: 30 } },\n        React.createElement(\n          'h2',\n          null,\n          'Koko'\n        ),\n        React.createElement(\n          'ul',\n          null,\n          this.renderApps(this.state.apps)\n        )\n      );\n    }\n  };\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/Index.module.jsx\n ** module id = 223\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/Index.module.jsx?");

/***/ },

/***/ 224:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\n\nvar core = __webpack_require__(39);\n\nvar PropTypes = React.PropTypes;\n\nvar style = {\n  fontWeight: 'bold',\n  cursor: 'pointer',\n  color: '#3856B1'\n};\n\ncore.Component('View', {\n  getInitialState: function getInitialState() {\n    return {\n      isOpen: false\n    };\n  },\n  toggle: function toggle() {\n    this.setState({ isOpen: !this.state.isOpen });\n  },\n  renderView: function renderView(view, index) {\n    if (view.key === 'index') return;\n    return React.createElement(core.components.View, { key: index, view: view, path: this.props.path + '/' + view.key });\n  },\n  renderApps: function renderApps(apps) {\n    var array = Object.keys(apps).map(function (v) {\n      return { key: v, value: apps[v] };\n    });\n    return array.map(this.renderView);\n  },\n  renderContent: function renderContent(apps) {\n    if (!this.state.isOpen) return null;\n    return this.renderApps(apps);\n  },\n\n  render: function render() {\n    var view = this.props.view;\n    if (!view.value) return React.createElement(\n      'li',\n      null,\n      React.createElement(\n        'a',\n        { href: this.props.path },\n        view.key\n      )\n    );\n    return React.createElement(\n      'li',\n      null,\n      React.createElement(\n        'span',\n        { style: style, onClick: this.toggle },\n        view.key\n      ),\n      React.createElement(\n        'ul',\n        null,\n        this.renderContent(view.value)\n      )\n    );\n  }\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/View.module.jsx\n ** module id = 224\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/View.module.jsx?");

/***/ }

});