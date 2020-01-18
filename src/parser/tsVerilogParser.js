const BaseParser = require('./parser')
const fs = require('fs');
const os = require("os");
const path = require('path');
const Parser = require('tree-sitter');
const VerilogParser = require('tree-sitter-verilog');

// const parser = new Parser();
// parser.setLanguage(VerilogParser);

// const source = '..'+path.sep+'..'+path.sep+'test'+path.sep+'examples'+path.sep+'verilog'+path.sep+'example_7.v'
// const sourceCode = fs.readFileSync(source,'utf8');

var lines
arr = []

// console.log(getAll(sourceCode));

function getAll(sourceCode) {
  const parser = new Parser();
  parser.setLanguage(VerilogParser);
  lines = fileLines(sourceCode)
  const tree = parser.parse(sourceCode);
  // console.log(tree.rootNode);
  // fs.writeFile("tree.json", tree.rootNode, function(err) {  });
  var structure = {
        // 'libraries': this.getLibraries(str),
    "entity": getEntityName(tree.rootNode), // module
    "generics": getGenerics(tree.rootNode), // parameters
    "ports": getPorts(tree.rootNode),
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
     }else if (element != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.childCount; i++){
               result = searchTree(element.child(i), matchingTitle);
          }
          return result;
     }
     return null;
}

function getPortName(port,split_code){
  arr = [];
  searchTree(port,'list_of_variable_identifiers');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0])
    return port_name;
  }
  else{
    var port_name = extractData(arr[0])
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getPortNameAnsi(port,split_code){
  arr = [];
  searchTree(port,'port_identifier');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0])
    return port_name;
  }
  else{
    var port_name = extractData(arr[0])
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getPortType(port,split_code){
  arr = [];
  searchTree(port,'net_port_type1');
  if (arr[0] == null){
    return "";
  }
  var port_type = extractData(arr[0])
  return port_type;
}
function getPortKind(port,split_code){
  arr = [];
  searchTree(port,'port_direction');
  if (arr[0] == null){
    return;
  }
  var port_type = extractData(arr[0])
  return port_type;
}

function addPort(element,key,name,direction,type,ansi,items){
  var item={};
  arr = []
  searchTree(element,key);
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      'name':  name(inputs[x],lines),
      'direction':  ((ansi == true)? direction(inputs[x],lines):direction),
      'type':  type(inputs[x],lines)
    }
    items.push(item);
  }
  return items
}

function getPorts(tree){
  arr = [];
  var items=[];
  var item={};
  var element = tree;
  //Inputs
  items = addPort(element,'input_declaration',getPortName,'input',getPortType,false,items)
  //Outputs
  items = addPort(element,'output_declaration',getPortName,'output',getPortType,false,items)
  //ansi_port_declaration
  items = addPort(element,'ansi_port_declaration',getPortNameAnsi,getPortKind,getPortType,true,items)
  //inouts
  items = addPort(element,'inout_declaration',getPortName,"inout",getPortType,false,items)
  return items
}

function getGenerics(tree) {
  // const key = ['module_header', 'simple_identifier'];
  // let key = 'parameter_port_list';
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
      "kind":  getGenericKind(inputs[x],lines)
    }
    items.push(item);
  }
  return items
}

function getGenericName(port,split_code){
  arr = [];
  searchTree(port,'list_of_variable_identifiers');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0])
    return port_name;
  }
  else{
    var port_name = extractData(arr[0])
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getGenericKind(port,split_code){
  arr = [];
  searchTree(port,'data_type_or_implicit1'); // parameter_identifier
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var port_name = extractData(arr[0])
    return port_name;
  }
  else{
    var port_name = extractData(arr[0])
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      return port_name;
  }
}

function getEntityName(tree) {
  arr = [];
  var element = tree;
  //Inputs
  arr = []
  searchTree(element,'module_header');
  element = arr
  arr = []
  searchTree(element[0],'simple_identifier');
  let item = {
    "name":  extractData(arr[0])
  };
  return item
}

function extractData (node){
  return lines[node.startPosition.row].substr(node.startPosition.column, node.endPosition.column-node.startPosition.column)
}

function fileLines(source) {
  var array = source.toString().split(os.EOL);
  return array
}

module.exports = getAll
