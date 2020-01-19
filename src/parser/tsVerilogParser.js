const BaseParser = require('./parser')
const fs = require('fs');
const os = require("os");
const path = require('path');
const Parser = require('tree-sitter');
const VerilogParser = require('tree-sitter-verilog');


arr = []

function getAll(sourceCode) {
  const parser = new Parser();
  parser.setLanguage(VerilogParser);
  var lines = fileLines(sourceCode)
  const tree = parser.parse(sourceCode);
  // console.log(tree.rootNode);
  fs.writeFile("tree.json", tree.rootNode, function(err) {  });
  var structure = {
        // 'libraries': this.getLibraries(str),
    "entity": getEntityName(tree.rootNode,lines), // module
    "generics": getGenerics(tree.rootNode,lines), // parameters
    "ports": getPorts(tree.rootNode,lines),
        // 'architecture': this.getArchitectureName(str),
        // 'signals': this.getSignals(str),  // regs
        // 'constants': this.getConstants(str),
        // 'types': this.getTypes(str),
        // 'process': this.getProcess(str)
  };
  return structure;
}

function searchTree(element,matchingTitle){
     if(element.type == matchingTitle){
          arr.push(element);
     }
     else if (element != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.childCount; i++){
               result = searchTree(element.child(i), matchingTitle);
          }
          return result;
     }
     return null;
}

function getPortName(port,lines){
  arr = [];
  searchTree(port,'list_of_variable_identifiers');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0],lines)
    return port_name;
  }
  else{
    var port_name = extractData(arr[0],lines)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getPortNameAnsi(port,lines){
  arr = [];
  searchTree(port,'port_identifier');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0],lines)
    return port_name;
  }
  else{
    var port_name = extractData(arr[0],lines)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getPortType(port,lines){
  arr = [];
  searchTree(port,'net_port_type1');
  if (arr[0] == null){
    return "";
  }
  var port_type = extractData(arr[0],lines)
  return port_type;
}
function getPortKind(port,lines){
  arr = [];
  searchTree(port,'port_direction');
  if (arr[0] == null){
    return;
  }
  var port_type = extractData(arr[0],lines)
  return port_type;
}

function addPort(element,key,name,direction,type,ansi,items,comments,lines){
  var item={};
  arr = []
  searchTree(element,key);
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    var port_name = name(inputs[x],lines)
    port_name = port_name.split(',')
    for (var i = 0; i < port_name.length; i++) {
      item = {
        'name':  port_name[i],
        'direction':  ((ansi == true)? direction(inputs[x],lines):direction),
        'type':  type(inputs[x],lines),
        "index": index(inputs[x]),
        "comment": comments[inputs[x].startPosition.row]
      }
      items.push(item);
    }
  }
  return items
}

function getPorts(tree,lines){
  arr = [];
  var items=[];
  var item={};
  var element = tree;
  //Comments
  comments = getComments(element,lines)
  //Inputs
  items = addPort(element,'input_declaration',getPortName,'input',getPortType,false,items,comments,lines)
  //Outputs
  items = addPort(element,'output_declaration',getPortName,'output',getPortType,false,items,comments,lines)
  //ansi_port_declaration
  items = addPort(element,'ansi_port_declaration',getPortNameAnsi,getPortKind,getPortType,true,items,comments,lines)
  //inouts
  items = addPort(element,'inout_declaration',getPortName,"inout",getPortType,false,items,comments,lines)
  return items
}

function getComments (tree,lines){
  var item={};
  arr = []
  searchTree(tree,'comment');
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item[inputs[x].startPosition.row] = extractData(inputs[x],lines).substr(2)
  }
  return item
}

function getGenerics(tree,lines) {
  arr = [];
  var items=[];
  var item={};
  var element = tree;
  //Inputs
  arr = []
  searchTree(element,'parameter_declaration');
  if (arr== null) {
    searchTree(element,'parameter_port_declaration');
  }
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      "name":  getGenericName(inputs[x],lines),
      "kind":  getGenericKind(inputs[x],lines),
      "index": index(inputs[x])
    }
    items.push(item);
  }
  return items
}

function getGenericName(port,lines){
  arr = [];
  searchTree(port,'list_of_variable_identifiers');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0],lines)
    return port_name;
  }
  else{
    var port_name = extractData(arr[0],lines)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getGenericKind(port,lines){
  arr = [];
  searchTree(port,'data_type_or_implicit1'); // parameter_identifier, data_type_or_implicit1
  if(arr.length == 0){
    arr = []
    return "";
  }
  else{
    var port_name = extractData(arr[0],lines)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getEntityName(tree,lines) {
  arr = [];
  var element = tree;
  searchTree(element,'module_header');
  element = arr
  arr = []
  searchTree(element[0],'simple_identifier');
  let item = {
    "name":  extractData(arr[0],lines),
    "index": index(arr[0])
  };
  return item
}

function extractData (node,lines){
  return lines[node.startPosition.row].substr(node.startPosition.column, node.endPosition.column-node.startPosition.column)
}

function index (node){
  return [node.startPosition.row, node.startPosition.column]
}

function fileLines(source) {
  var array = source.toString().split(os.EOL);
  return array
}

module.exports = getAll
