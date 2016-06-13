

var React = require('react');
var PropTypes = React.PropTypes;
var core = require('core');

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/terminal';
require('brace/mode/markdown');



window.parseAsFunction = function parseAsFunction(str, args){
  var array = str.split('=>');
  var argsArray = array[0].split(',').map(n => n.trim());
  var body = array[1];
  var bodyParts = [];
  var current = [];
  var result = [];
  var part, char;
  for (var i = 0; i < body.length; i++) {
    char = body[i];
    if(char === '{'){
      bodyParts.push({ type: 'string', value: current.join('') });
      current = [];
    }
    else if(char === '}'){
      var z = bodyParts.push({ type: 'variable', value: current.filter(n => n && (n !== ' ')).join('') });
      current = [];
    }
    else{
      current.push(char);
    }
  }
  if(current.length) bodyParts.push({ type: 'string', value: current.join('') });
  // console.dir(argsArray);
  // console.dir(bodyParts);
  var a, b;
  for (var k = 0; k < bodyParts.length; k++) {
    part = bodyParts[k];
    if(part.type === 'string') result.push(part.value);
    else {
      a = argsArray.indexOf(part.value);
      result.push(args[a])
    }
  }
  return result.join('').trim();
};

function isOperator(c){ return /[+\-*\/\^%=(),]/.test(c); }
function isDigit(c) { return /[0-9\.]/.test(c); }
function isWhiteSpace(c) { return /\s/.test(c); }
function isString(c) { return /["']/.test(c); }
function isIdentifier(c) { return /[A-z$_.]/.test(c); }
function isArrowFunction(c, c2) { return (c === '=' && c2 === '>'); }

var operators = {
    "+": function(a, b) {
        return a + b;
    },
    "-": function(a, b) {
        if (typeof b === "undefined") return -a;
        return a - b;
    },
    "*": function(a, b) {
        return a * b;
    },
    "/": function(a, b) {
        return a / b;
    },
    "%": function(a, b) {
        return a % b;
    },
    "^": function(a, b) {
        return Math.pow(a, b);
    }
};

var variables = {
    pi: Math.PI,
    e: Math.E
};

var functions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.cos,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    abs: Math.abs,
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor,
    log: Math.log,
    exp: Math.exp,
    sqrt: Math.sqrt,
    max: Math.max,
    min: Math.min,
    random: Math.random
};

var args = {};

function Lexer(){ };

/*
*   produce an array of token objects from a string.
*   a token object has a 'type' property which is one of 'identifier', 'string', 'number', or 'operator'
*/

console.log('ok');

Lexer.prototype = {
  maxChars: 1000,
  lex(input){
    this.input = input;
    this.tokens = [];
    this.index = 0;
    this.char = '';

    var start, num, str;

    var count = 0;

    while (this.index < input.length) {
      count++;
      // console.log(this.char);
      if(count > 1000) return this.tokens;
      this.char = this.input[this.index];
      if(isString(this.char)) this.addStringToken();
      else if (isWhiteSpace(this.char)) this.advance();
      else if (isArrowFunction(this.char, this.input[this.index + 1])) this.addArrowFunctionToken();
      else if (isOperator(this.char)) {
        this.addToken('operator', this.char);
        this.advance();
      }
      else if (isDigit(this.char)) this.addNumberToken();
      else this.addIdentifierToken();
    }
    this.addToken("(end)");
    return this.tokens;
  },
  advance() {      // move to the next char and return it.
    this.index += 1;
    this.char = this.input[this.index];
    return this.char;
  },
  addToken(type, value) {
    this.tokens.push({
      type: type,
      value: value
   });
  },
  addArrowFunctionToken(){
    // console.log('f');
    this.addToken('function', '=>');
    this.advance();
    this.advance();
  },
  addStringToken(){
    // console.log('s');
    var start = this.char;
    var string = '';
    var count = 0;
    while(count < 10000 && this.advance() !== start){
      count++;
      string += this.char;
    }
    this.addToken('string', string);
    this.advance();
  },
  addNumberToken(){
    // console.log('n');
    var number = this.char;
    while (isDigit(this.advance())) {
      number += this.char;
    }
    number = (number.indexOf('.') > -1) ? parseFloat(number) : parseInt(number);
    this.addToken('number', number)
  },
  addIdentifierToken(){
    // console.log('i');
    var identifier = this.char;
    var count = 0;
    var char = this.advance();
    while (isIdentifier(char) && count < 10){
      count++;
      char = this.advance();
      identifier = (identifier + this.char);
    }
    this.addToken("identifier", identifier);
  }
};

function Parser(){

  this.tokens = [];
  this.symbols = {};
  this.index = 0;

  this.prefix("-", 7);
  this.infix("^", 6, 5);
  this.infix("*", 4);
  this.infix("/", 4);
  this.infix("%", 4);
  this.infix("+", 3);
  this.infix("-", 3);
  this.infix("=", 1, 2, (left)=> {
    if (left.type === "identifier") {
      return {
        type: "assign",
        name: left.value,
        value: this.expression(2)
      };
    }
    else if (left.type === "call") {
      console.dir(left);
      return {
        type: "call",
        name: left.value,
        args: left.args,
        value: this.expression(2)
      };
    }
    else {
      // throw "Invalid value";
      console.dir(left.type);
    }
  });

  this.symbol(",");
  this.symbol(")");
  this.symbol("(end)");

  this.symbol("(", ()=> {
    var value = this.expression(2);
    if (this.token().value !== ")") throw "Expected closing parenthesis ')'";
    this.advance();
    return value;
  });
  this.symbol("number", function (number) {
      return number;
  });

  this.symbol("identifier", (name)=> {
    if (this.token().value === "(") {         // function call
      var args = [];
      if (this.tokens[this.index + 1].value === ")") this.advance();
      else {
        do {
          this.advance();
          args.push(this.expression(2));
        } while (this.token().value === ",");
        if (this.token().value !== ")") throw "Expected closing parenthesis ')'";
      }
      this.advance();
      return {
        type: "call",
        args: args,
        name: name.value
      };
    }
    return name;
  });
}

Parser.prototype = {
  symbol(id, nud, lbp, led) {
    var sym = this.symbols[id] || {};
    this.symbols[id] = {
      lbp: sym.lbp || lbp,  // left binding power
      nud: sym.nud || nud, // null denotative function
      led: sym.led || led  // left denotative function
    };
  },
  interpretToken(token) {
    var sym = Object.create(this.symbols[token.type] || this.symbols[token.value]);
    sym.type = token.type;
    sym.value = token.value;
    return sym;
  },
  token() {
    return this.interpretToken(this.tokens[this.index]);
  },

  advance(){
    this.index += 1;
    return this.token();
  },
  parse(tokens){
    this.tokens = tokens;
    this.index = 0;
    this.parseTree = [];
    while (this.token().type !== "(end)") {
      this.parseTree.push(this.expression(0));
    }
    console.debug('parseTree:', this.parseTree);
    return this.parseTree;
  },
  expression(rbp) {
    var left, token = this.token();
    this.advance();
    if (!token.nud) throw "Unexpected token: " + token.value;
    left = token.nud(token);
    while (rbp < this.token().lbp) {
      token = this.token();
      this.advance();
      if (!token.led) throw "Unexpected token: " + token.value;
      left = token.led(left);
    }
    return left;
  },
  infix(id, lbp, rbp, led) {
    rbp = rbp || lbp;
    var t = this;
    this.symbol(id, null, lbp, led || function(left) {
      return {
        type: id,
        left: left,
        right: t.expression(rbp)
      };
    });
  },
  prefix(id, rbp) {
    var t = this;
    this.symbol(id, function() {
      return {
        type: id,
        right: t.expression(rbp)
      };
    });
  }
};


function Evaluator(){
  this.args = {};
  this.scope = {};
}

Evaluator.prototype = {
  parseNode(node) {
    if (node.type === "number") return node.value;
    else if (operators[node.type]) {
      if (node.left) return operators[node.type](this.parseNode(node.left), this.parseNode(node.right));
      return operators[node.type](this.parseNode(node.right));
    }
    else if (node.type === "identifier") {
      var value = this.args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
      if (typeof value === "undefined") throw node.value + " is undefined";
      return value;
    }
    else if (node.type === "assign") {
      console.log(node.name);
      variables[node.name] = this.parseNode(node.value);
    }
    else if (node.type === "call") {
      for (var i = 0; i < node.args.length; i++) node.args[i] = this.parseNode(node.args[i]);
      if(this.scope[node.name]){
        if(typeof this.scope[node.name] === 'function'){
          return this.scope[node.name].apply(this.scope, node.args);
        }
        else throw new Error(node.name + ' is not a function')
      }
      if(functions[node.name]) return functions[node.name].apply(null, node.args);
      throw new Error(node.name + ' is not a function')
    }
    else if (node.type === "function") {
      functions[node.name] = function () {
        for (var i = 0; i < node.args.length; i++) {
          args[node.args[i].value] = arguments[i];
        }
        var ret = parseNode(node.value);
        this.args = {};
        return ret;
      };
    }
  },
  evaluate(parseTree, scope){
    this.args = {};
    this.scope = scope || {};
    var output = "";
    for (var i = 0; i < parseTree.length; i++) {
      var value = this.parseNode(parseTree[i]);
      if (typeof value !== "undefined") output += value;
    }
    return output;
  }
};

var lexer = window.lexer = new Lexer();
var parser = window.parser = new Parser();
var evaluator = window.evaluator = new Evaluator();

var run = window.run = function (input, scope) {
  try {
    var tokens = lexer.lex(input);
    var parseTree = parser.parse(tokens);
    var output = evaluator.evaluate(parseTree, scope);
    return output;
  } catch (e) {
    return e;
  }
};


function onChange(newValue) {
  console.log('change',newValue);
}


core.Component('Editor', {
  render: function() {
    // console.log('render');
    return (
      <AceEditor { ...this.props }/>
    );
  }
});

core.Component('FileSystemItem', {
  contextTypes: {
    shell: React.PropTypes.object
  },
  getInitialState(){
    return {
      isOpen: false,
      children: []
    };
  },

  renderChild(child, i){
    return <core.components.FileSystemItem key={ i } item={ child } path={ [...this.props.path, child.name] }/>
  },
  toggle(e){
    e.stopPropagation();
    if(!this.state.isOpen){
      core.connection.action('fs.readdir', {path: this.props.path}, this.setChildren);
    }
    this.setState({ isOpen: !this.state.isOpen });
  },
  setChildren(children){
    this.setState({
      children: children
    });
  },
  openFile(){
    this.emit('openFile', this.props.item, this.props.path);
  },
  render: function() {
    var style = { paddingLeft: 16, cursor: 'pointer', position: 'relative', paddingLeft: 20 }
    if(this.props.item.type === 'file'){
      return (
        <div style={ style } onClick={ this.openFile }>{ this.props.item.name }</div>
      );
    }
    return (
      <div style={ style} onClick={ this.toggle }>
        <span style={{ position: 'absolute', top: 2, left: 2, fontSize: '12px'}}>{ (this.state.isOpen ? '▼' : '►' ) }</span>
        { this.props.item.name }
        { this.state.isOpen ? this.state.children.map(this.renderChild) : null }
      </div>
    );
  }
});

core.Component('FileSystem', ['FileSystemItem'], (FileSystemItem)=>{
  return {

    getInitialState(){
      return {
        items: []
      }
    },
    renderItem(item, i){
      return <FileSystemItem key={ i } item={ item } path={ [item.name] }/>
    },
    render: function() {
      // console.log('render');
      return (
        <div style={{ userSelect: 'none'}}>{ this.props.items.map(this.renderItem) }</div>
      );
    }
  };
});

core.Component('FileEditor', ['Editor', 'divide.Vertical', 'FileSystem'], (Editor, Vertical, FileSystem)=>{
  return {
    events: {
      'openFile': 'openFile'
    },
    getInitialState(){
      core.connection.action('fs.readdir', {path: []}, this.setItems);
      return {
        mode: 'javascript',
        items: [],
        file: ''
      };
    },
    setItems(data){
      var folders = [],
          files = [];
      data.map((item)=>{
        if(item.type === 'file') files.push(item);
        else folders.push(item);
      });
        this.setState({
          items: folders.concat(files)
        });
    },
    contextTypes: {
      shell: React.PropTypes.object
    },
    openFile(item, path){
      window.a = this.refs.editor;
      // return console.dir(item, path);
      core.connection.action('fs.readfile', {path: path}, this.setFile);
    },
    setFile(file){
      this.setState({
        file: file
      });
    },
    readDir(dir){

    },
    onCodeChange(v){
      console.log(v);
    },
    render: function() {
      // console.log('render');
      return (
        <Vertical>
        <FileSystem items={ this.state.items }/>
          <AceEditor
            mode={ this.state.mode }
            theme="terminal"
            onChange={this.onCodeChange}
            name="UNIQUE_ID_OF_DIV"
            width="100%"
            height="100%"
            ref="editor"
            value={ this.state.file }
            editorProps={{$blockScrolling: true}}
          />
        </Vertical>
      );
    }
  };
});

core.Component('Run', ['FileEditor'], (FileEditor)=>{
  return {
    getInitialState(){
      return {
        history: [],
        input: '',
        output: ''
      };
    },
    contextTypes: {
      shell: React.PropTypes.object
    },
    readDir(dir){
      core.connection.action('fs.readdir', {path: []}, (data)=>{
        console.dir(data);
      });
    },
    onKeyUp(e){
      if(e.keyCode === 13) {
        var input = this.state.input;
        if(!input) return;
        var history = this.state.history;
        var scroll = this.refs.scroll;
        history.push({ type: 'input', value: input});
        var output = run(input);
        history.push({ type: 'output', value: output});
        this.setState({
          input: '',
          output: output,
          history: history
        });
        scroll.scrollTop = scroll.scrollHeight;
      }
    },
    onChange(e){
      var input = e.target.value;
      this.setState({
        input: input
      });
    },

    renderHistoryItem(item, i){
      if(item.type === 'input'){
        return (<div key={ i } style={{ color: '#444'}}><span style={{color: '#ddd'}}>{ ' ' }</span>  { item.value.toString() }</div>);
      }
      return (<div key={ i } style={{ color: '#888'}}><span style={{color: '#aaa'}}>{ '>' }</span> { item.value.toString()}</div>);
    },
    render: function() {
      // console.log('render');
      return (

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', right: 0 }}>
          <button style={{  }} onClick={ this.readDir }>click</button>
          <div style={{ position: 'absolute', top: 30, bottom: 0, left: 0, right: 0 }}>
            <FileEditor/>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '50%' }} onClick={()=>{ this.refs.input.focus() }}>
          <div ref="scroll" style={{ position: 'absolute', top: 0, bottom: 30, left: 0, right: 0, overflow: 'auto' }}>
            { this.state.history.map(this.renderHistoryItem) }
            <input ref="input" value={ this.state.input } onChange={ this.onChange } onKeyUp={ this.onKeyUp } style={{ width: '100%', border: 0, outline: 'none'}}/>
          </div>
          <div style={{ position: 'absolute', bottom: 0, height: 30, left: 0, right: 0 }}>
          </div>
        </div>
        </div>
      );
    }
  };
});
// core.Component('Editor', {
//   debug: true,
//   render: function() {
//     // console.log('render');
//     return (
//       <AceEditor { ...this.props }/>
//     );
//   }
// });
