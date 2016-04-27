webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi app\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_app?");

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\nvar App = __webpack_require__(159);\nvar ReactDom = __webpack_require__(222);\n\nReactDom.render(React.createElement(App, null), document.getElementById('app'));\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/init.jsx\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/init.jsx?");

/***/ },

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\n\nvar core = __webpack_require__(160);\nvar View = __webpack_require__(234);\n\nmodule.exports = React.createClass({\n  displayName: 'exports',\n\n  mixins: [core.mixins.app],\n  app: {\n    domain: 'http://localhost',\n    port: 4000\n  },\n  getInitialState: function getInitialState() {\n    return {\n      views: {}\n    };\n  },\n  componentDidMount: function componentDidMount() {\n    var _this = this;\n\n    this.connection.action('shell.views.getViews', function (views) {\n      _this.setState({\n        views: views\n      });\n    });\n  },\n  renderView: function renderView(view, index) {\n    if (view.key === 'index') return;\n    return React.createElement(View, { key: index, view: view, path: '/' + view.key });\n  },\n  renderViews: function renderViews(views) {\n    var array = Object.keys(views).map(function (v) {\n      return { key: v, value: views[v] };\n    });\n    return array.map(this.renderView);\n  },\n  render: function render() {\n    return React.createElement(\n      'div',\n      { style: { padding: 30 } },\n      React.createElement(\n        'h2',\n        null,\n        'Koko'\n      ),\n      React.createElement(\n        'ul',\n        null,\n        this.renderViews(this.state.views)\n      )\n    );\n  }\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/App.jsx\n ** module id = 159\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/App.jsx?");

/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\n\nvar core = __webpack_require__(160);\n\nvar PropTypes = React.PropTypes;\nvar style = {\n  fontWeight: 'bold',\n  cursor: 'pointer',\n  color: '#3856B1'\n};\nvar View = React.createClass({\n  displayName: 'View',\n  getInitialState: function getInitialState() {\n    return {\n      isOpen: false\n    };\n  },\n  toggle: function toggle() {\n    this.setState({ isOpen: !this.state.isOpen });\n  },\n  renderView: function renderView(view, index) {\n    if (view.key === 'index') return;\n    return React.createElement(View, { key: index, view: view, path: this.props.path + '/' + view.key });\n  },\n  renderViews: function renderViews(views) {\n    var array = Object.keys(views).map(function (v) {\n      return { key: v, value: views[v] };\n    });\n    return array.map(this.renderView);\n  },\n  renderContent: function renderContent(views) {\n    if (!this.state.isOpen) return null;\n    return this.renderViews(views);\n  },\n\n  render: function render() {\n    var view = this.props.view;\n    if (!view.value) return React.createElement(\n      'li',\n      null,\n      React.createElement(\n        'a',\n        { href: this.props.path },\n        view.key\n      )\n    );\n    return React.createElement(\n      'li',\n      null,\n      React.createElement(\n        'span',\n        { style: style, onClick: this.toggle },\n        view.key\n      ),\n      React.createElement(\n        'ul',\n        null,\n        this.renderContent(view.value)\n      )\n    );\n  }\n});\n\nmodule.exports = View;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./app/View.jsx\n ** module id = 234\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./app/View.jsx?");

/***/ }

});