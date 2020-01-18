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

// console.log(getAll(sourceCode));

arr = []
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
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    console.log("- Port name: " + port_name);
    return port_name;
  }
  else{
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      console.log("- Port name: " + split_port_name[x].replace(/ /g,''));
      return port_name;
  }
}

function getPortNameAnsi(port,split_code){
  arr = [];
  searchTree(port,'port_identifier');
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    console.log("- Port name: " + port_name);
    return port_name;
  }
  else{
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      console.log("- Port name: " + split_port_name[x].replace(/ /g,''));
      return port_name;
  }
}

function getPortType(port,split_code){
  arr = [];
  searchTree(port,'net_port_type1');
  if (arr[0] == null){
    console.log("- Port type: ");
    return "";
  }
  var line = split_code[arr[0].startPosition.row]
  var port_type = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
  console.log("- Port type: " + port_type);
  return port_type;
}
function getPortKind(port,split_code){
  arr = [];
  searchTree(port,'port_direction');
  if (arr[0] == null){
    console.log("- Port type: ");
    return;
  }
  var line = split_code[arr[0].startPosition.row]
  var port_type = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
  console.log("- Port type: " + port_type);
  return port_type;
}

function getPorts(tree){
  arr = [];
  var items=[];
  var item={};
  var element = tree;
  //Inputs
  console.log("----------- Inputs -----------");
  arr = []
  searchTree(element,'input_declaration');
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      'name':  getPortName(inputs[x],lines),
      'kind':  'input',
      'type':  getPortType(inputs[x],lines)
    }
    console.log("--");
    items.push(item);
  }
  //Outputs
  console.log("----------- Outputs -----------");
  arr = []
  searchTree(element,'output_declaration');
  // searchTree(element,'ansi_port_declaration');
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      "name":  getPortName(inputs[x],lines),
      "kind":  "output",
      "type":  getPortType(inputs[x],lines)
    }
    console.log("--");
    items.push(item);
  }
  //ansi_port_declaration
  console.log("----------- ansi_port_declaration -----------");
  arr = []
  searchTree(element,'ansi_port_declaration');
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      "name":  getPortNameAnsi(inputs[x],lines),
      "kind":  getPortKind(inputs[x],lines),
      "type":  getPortType(inputs[x],lines)
    }
    console.log("--");
    items.push(item);
  }
  //inouts
  console.log("----------- inouts -----------");
  arr = []
  searchTree(element,'inout_declaration');
  inputs = arr;
  for(var x = 0; x < inputs.length;++x){
    item = {
      "name":  getPortName(inputs[x],lines),
      "kind":  "inout",
      "type":  getPortType(inputs[x],lines)
    }
    console.log("--");
    items.push(item);
  }
  return items
}



function getAll(sourceCode) {
  const parser = new Parser();
  parser.setLanguage(VerilogParser);
  lines = fileLines(sourceCode)
  const tree = parser.parse(sourceCode);
  // console.log(tree.rootNode);
  fs.writeFile("tree.json", tree.rootNode, function(err) {  });
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
  console.log(inputs);
  for(var x = 0; x < inputs.length;++x){
    item = {
      "name":  getGenericName(inputs[x],lines),
      "kind":  getGenericKind(inputs[x],lines)
    }
    console.log("--");
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
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    console.log("- Port name: " + port_name);
    return port_name;
  }
  else{
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      console.log("- Port name: " + split_port_name[x].replace(/ /g,''));
      return port_name;
  }
}

function getGenericKind(port,split_code){
  arr = [];
  searchTree(port,'data_type_or_implicit1'); // parameter_identifier
  if(arr.length == 0){
    arr = []
    searchTree(port,'simple_identifier');
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    console.log("- Port name: " + port_name);
    return port_name;
  }
  else{
    var line = split_code[arr[0].startPosition.row]
    var port_name = line.substring(arr[0].startPosition.column,arr[0].endPosition.column)
    var split_port_name = port_name.split(',')
    for(var x = 0;x < split_port_name.length; ++x)
      console.log("- Port name: " + split_port_name[x].replace(/ /g,''));
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
