webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi app\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_app?");

/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\nvar ReactDom = __webpack_require__(159);\nvar core = __webpack_require__(160);\nvar Baobab = __webpack_require__(161);\n__webpack_require__(209);\n\ncore.loadContext(__webpack_require__(350));\n\nvar element = document.getElementById('app');\ncore.require(['core.App', 'Modules'], function (App, Modules) {\n    ReactDom.render(React.createElement(\n        App,\n        null,\n        React.createElement(Modules, null)\n    ), element);\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./App.jsx\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./App.jsx?");

/***/ },

/***/ 211:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./divide/Horizontal.module.jsx\": 212,\n\t\"./divide/HorizontalDrop.module.jsx\": 213,\n\t\"./divide/HorizontalLine.module.jsx\": 214,\n\t\"./divide/Vertical.module.jsx\": 215,\n\t\"./divide/VerticalDrop.module.jsx\": 216,\n\t\"./divide/VerticalLine.module.jsx\": 217,\n\t\"./dnd/Drag.module.jsx\": 218,\n\t\"./dnd/Drop.module.jsx\": 219,\n\t\"./dnd/DropPad.module.jsx\": 220,\n\t\"./screen/Screen.module.jsx\": 221,\n\t\"./shell/Btn.module.jsx\": 222,\n\t\"./shell/Config.module.jsx\": 223,\n\t\"./shell/Open.module.jsx\": 224,\n\t\"./shell/Shell.module.jsx\": 225,\n\t\"./shell/debug/Debug.module.jsx\": 229,\n\t\"./shell/modules/Modules.module.jsx\": 231,\n\t\"./shell/readme/ReadMe.module.jsx\": 232\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 211;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** /Users/ido/Documents/core/clients/exports/dev .*\\.module\\.js\n ** module id = 211\n ** module chunks = 0\n **/\n//# sourceURL=webpack:////Users/ido/Documents/core/clients/exports/dev_.*\\.module\\.js?");

/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./Koko.module.jsx\": 236,\n\t\"./koko.module.js\": 249\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 235;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** /Users/ido/Documents/core/clients/exports/koko .*\\.module\\.js\n ** module id = 235\n ** module chunks = 0\n **/\n//# sourceURL=webpack:////Users/ido/Documents/core/clients/exports/koko_.*\\.module\\.js?");

/***/ },

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./Input.module.jsx\": 253,\n\t\"./SmartSelect/SmartSelect.module.jsx\": 254,\n\t\"./Submit.module.jsx\": 269,\n\t\"./forms.module.js\": 270,\n\t\"./mixins/form.mixin.module.jsx\": 352,\n\t\"./mixins/input.mixin.module.jsx\": 353\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 250;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** /Users/ido/Documents/core/clients/exports/forms .*\\.module\\.js\n ** module id = 250\n ** module chunks = 0\n **/\n//# sourceURL=webpack:////Users/ido/Documents/core/clients/exports/forms_.*\\.module\\.js?");

/***/ },

/***/ 271:
/***/ function(module, exports) {

	eval("function webpackContext(req) {\n\tthrow new Error(\"Cannot find module '\" + req + \"'.\");\n}\nwebpackContext.keys = function() { return []; };\nwebpackContext.resolve = webpackContext;\nmodule.exports = webpackContext;\nwebpackContext.id = 271;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** /Users/ido/Documents/core/clients/exports/layout .*\\.module\\.js\n ** module id = 271\n ** module chunks = 0\n **/\n//# sourceURL=webpack:////Users/ido/Documents/core/clients/exports/layout_.*\\.module\\.js?");

/***/ },

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./Loader/ui.Loader.module.jsx\": 273,\n\t\"./colorPicker/ui.Color.module.jsx\": 276,\n\t\"./refresh/ui.Refresh.module.jsx\": 278,\n\t\"./scroll/ui.Scroll.module.jsx\": 281,\n\t\"./ui.Button.module.jsx\": 298,\n\t\"./ui.CheckBox.module.jsx\": 345,\n\t\"./ui.CloseBtn.module.jsx\": 346,\n\t\"./ui.Header.module.jsx\": 347,\n\t\"./ui.Icon.module.jsx\": 348,\n\t\"./ui.module.js\": 349\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 272;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** /Users/ido/Documents/core/clients/exports/ui .*\\.module\\.js\n ** module id = 272\n ** module chunks = 0\n **/\n//# sourceURL=webpack:////Users/ido/Documents/core/clients/exports/ui_.*\\.module\\.js?");

/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	eval("var map = {\n\t\"./Modules.module.jsx\": 351\n};\nfunction webpackContext(req) {\n\treturn __webpack_require__(webpackContextResolve(req));\n};\nfunction webpackContextResolve(req) {\n\treturn map[req] || (function() { throw new Error(\"Cannot find module '\" + req + \"'.\") }());\n};\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = 350;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./modules .*\\.module\\.js\n ** module id = 350\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./modules_.*\\.module\\.js?");

/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar React = __webpack_require__(2);\nvar core = __webpack_require__(160);\nvar PropTypes = React.PropTypes;\n\ncore.Component('Module', {\n  getInitialState: function getInitialState() {\n    return {\n      isOpen: false\n    };\n  },\n  toggle: function toggle() {\n    var dependents = core.getDependents(this.props.module.name);\n    var dependencies = core.getDependencies(this.props.module.name);\n    console.log('t');\n    if (!this.state.isOpen) {\n      this.setState({\n        isOpen: true,\n        dependents: dependents,\n        dependencies: dependencies\n      });\n    } else {\n      this.setState({ isOpen: false });\n    }\n  },\n  render: function render() {\n    var module = this.props.module;\n    var state = this.state;\n    return React.createElement(\n      'div',\n      { onClick: this.toggle },\n      React.createElement(\n        'div',\n        { style: { display: 'flex', borderBottom: '1px solid #ddd' } },\n        React.createElement(\n          'div',\n          { style: { flex: 1 } },\n          React.createElement(\n            'div',\n            null,\n            module.name\n          )\n        ),\n        React.createElement(\n          'div',\n          { style: { flex: 1 } },\n          module.path\n        )\n      ),\n      function () {\n        if (!state.isOpen) return null;\n        console.log('ok');\n        return React.createElement(\n          'div',\n          { style: { paddingBottom: '30px', borderBottom: '1px solid #ddd' } },\n          React.createElement(\n            'h3',\n            null,\n            module.name\n          ),\n          React.createElement(\n            'div',\n            { style: { display: 'flex' } },\n            React.createElement(\n              'div',\n              { style: { flex: 1 } },\n              React.createElement(\n                'h4',\n                null,\n                state.dependencies.length,\n                ' Dependencies'\n              ),\n              React.createElement(\n                'div',\n                { style: { padding: '0 0 0 20px' } },\n                React.createElement(\n                  'div',\n                  null,\n                  state.dependencies.map(function (item, i) {\n                    return React.createElement(\n                      'div',\n                      { key: i },\n                      ' ➜ ',\n                      item\n                    );\n                  })\n                )\n              )\n            ),\n            React.createElement(\n              'div',\n              { style: { flex: 1 } },\n              React.createElement(\n                'h4',\n                null,\n                state.dependents.length,\n                ' Dependents'\n              ),\n              React.createElement(\n                'div',\n                { style: { padding: '0 0 0 20px' } },\n                React.createElement(\n                  'div',\n                  null,\n                  state.dependents.map(function (item, i) {\n                    return React.createElement(\n                      'div',\n                      { key: i },\n                      ' ➜ ',\n                      item\n                    );\n                  })\n                )\n              )\n            )\n          )\n        );\n      }()\n    );\n  }\n});\n\ncore.Component('Modules', ['shell.Btn', 'shell.Module'], function (Btn, Module) {\n  return {\n    contextTypes: {\n      shell: PropTypes.object\n    },\n    getInitialState: function getInitialState() {\n      var contexts = core.getContexts();\n      var modules = [];\n      var path, context, name;\n      for (context in contexts) {\n        for (name in contexts[context]) {\n          if (context === 'orphand') {\n            path = contexts[context][name];\n          } else {\n            path = '' + context + contexts[context][name].substr(1);\n          }\n          modules.push({\n            name: name,\n            path: path\n          });\n        }\n      }\n      return {\n        modules: modules,\n        value: ''\n      };\n    },\n    componentDidMount: function componentDidMount() {\n      this.refs.input.focus();\n    },\n    renderModule: function renderModule(module) {\n      return React.createElement(Module, { key: module.name, module: module });\n    },\n    filter: function filter(item) {\n      return item.name.toLowerCase().indexOf(this.state.value.toLowerCase()) > -1;\n    },\n    render: function render() {\n      var _this = this;\n\n      var filtered = this.state.value ? this.state.modules.filter(this.filter) : this.state.modules;\n\n      return React.createElement(\n        'div',\n        null,\n        React.createElement(\n          'div',\n          { style: { position: 'absolute', top: 0, right: 0, left: 0, height: '40px', padding: '5px', borderBottom: '1px solid #ddd' } },\n          React.createElement('input', { ref: 'input', value: this.state.value, onChange: function onChange(e) {\n              _this.setState({ value: e.target.value });\n            }, style: { width: '100%', outline: 0 } })\n        ),\n        React.createElement(\n          'div',\n          { style: { position: 'absolute', top: '40px', right: 0, left: 0, bottom: 0, padding: '5px', overflow: 'auto' } },\n          filtered.map(this.renderModule)\n        )\n      );\n    }\n  };\n});\n\n/*****************\n ** WEBPACK FOOTER\n ** ./modules/Modules.module.jsx\n ** module id = 351\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./modules/Modules.module.jsx?");

/***/ }

});