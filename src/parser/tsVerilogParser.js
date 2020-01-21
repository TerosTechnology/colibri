const BaseParser = require('./parser')
const fs = require('fs');
const os = require("os");
const path = require('path');
const Parser = require('tree-sitter');
const VerilogParser = require('tree-sitter-verilog');

class tsVerilogParser extends BaseParser {
  constructor() {
    super();
    this.arr = []
  }

  getAll(sourceCode) {
    const parser = new Parser();
    parser.setLanguage(VerilogParser);
    var lines = this.fileLines(sourceCode)
    const tree = parser.parse(sourceCode);
    // console.log(tree.rootNode);
    // fs.writeFile("tree.json", tree.rootNode, function(err) {  });
    var structure = {
      // 'libraries': this.getLibraries(str),
      "entity": this.getEntityName(tree.rootNode, lines), // module
      "generics": this.getGenerics(tree.rootNode, lines), // parameters
      "ports": this.getPorts(tree.rootNode, lines),
      // 'architecture': this.getArchitectureName(str),
      // 'signals': this.getSignals(str),  // regs
      // 'constants': this.getConstants(str),
      // 'types': this.getTypes(str),
      // 'process': this.getProcess(str)
    };
    return structure;
  }

  searchTree(element, matchingTitle) {
    if (element.type == matchingTitle) {
      this.arr.push(element);
    } else if (element != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.childCount; i++) {
        result = this.searchTree(element.child(i), matchingTitle);
      }
      return result;
    }
    return null;
  }

  getPortName(port, lines) {
    this.arr = [];
    this.searchTree(port, 'list_of_variable_identifiers');
    if (this.arr.length == 0) {
      this.arr = []
      this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(this.arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(this.arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getPortNameAnsi(port, lines) {
    this.arr = [];
    this.searchTree(port, 'port_identifier');
    if (this.arr.length == 0) {
      this.arr = []
      this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(this.arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(this.arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getPortType(port, lines) {
    this.arr = [];
    this.searchTree(port, 'net_port_type1');
    if (this.arr[0] == null) {
      return "";
    }
    var port_type = this.extractData(this.arr[0], lines)
    return port_type;
  }

  getPortKind(port, lines) {
    this.arr = [];
    this.searchTree(port, 'port_direction');
    if (this.arr[0] == null) {
      return;
    }
    var port_type = this.extractData(this.arr[0], lines)
    return port_type;
  }

  addPort(element, key, name, direction, type, ansi, items, comments, lines) {
    var item = {};
    var inputs = [];
    this.arr = []
    this.searchTree(element, key);
    inputs = this.arr;
    for (var x = 0; x < inputs.length; ++x) {
      var port_name
      switch (name) {
        case 'getPortName':
          port_name = this.getPortName(inputs[x], lines)
          break;
        case 'getPortNameAnsi':
          port_name = this.getPortNameAnsi(inputs[x], lines)
          break;
        default:
          name = this.getPortName
      }
      port_name = port_name.split(',')
      var directionVar = this.getPortKind(inputs[x], lines)
      var typeVar
      switch (type) {
        case 'getPortType':
          typeVar = this.getPortType(inputs[x], lines)
          break;
        default:
          typeVar = this.getPortType(inputs[x], lines)
      }
      for (var i = 0; i < port_name.length; i++) {
        item = {
          'name': port_name[i],
          'direction': ((ansi == true) ? directionVar : direction),
          'type': typeVar,
          "index": this.index(inputs[x]),
          "comment": comments[inputs[x].startPosition.row]
        }
        items.push(item);
      }
    }
    return items
  }

  getPorts(tree, lines) {
    this.arr = [];
    var items = [];
    var comments = [];
    var item = {};
    var element = tree;
    //Comments
    comments = this.getComments(element, lines)
    //Inputs
    items = this.addPort(element, 'input_declaration', 'getPortName', 'input', 'getPortType', false, items, comments, lines)
    //Outputs
    items = this.addPort(element, 'output_declaration', 'getPortName', 'output', 'getPortType', false, items, comments, lines)
    //ansi_port_declaration
    items = this.addPort(element, 'ansi_port_declaration', 'getPortNameAnsi', 'getPortKind', 'getPortType', true, items, comments, lines)
    //inouts
    items = this.addPort(element, 'inout_declaration', 'getPortName', "inout", 'getPortType', false, items, comments, lines)
    return items
  }

  getComments(tree, lines) {
    var item = {};
    var inputs = [];
    this.arr = []
    this.searchTree(tree, 'comment');
    inputs = this.arr;
    for (var x = 0; x < inputs.length; ++x) {
      item[inputs[x].startPosition.row] = this.extractData(inputs[x], lines).substr(2)
    }
    return item
  }

  getGenerics(tree, lines) {
    this.arr = [];
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    this.arr = []
    this.searchTree(element, 'parameter_declaration');
    if (this.arr == null) {
      this.searchTree(element, 'parameter_port_declaration');
    }
    inputs = this.arr;
    for (var x = 0; x < inputs.length; ++x) {
      item = {
        "name": this.getGenericName(inputs[x], lines),
        "kind": this.getGenericKind(inputs[x], lines),
        "index": this.index(inputs[x])
      }
      items.push(item);
    }
    return items
  }

  getGenericName(port, lines) {
    this.arr = [];
    this.searchTree(port, 'list_of_variable_identifiers');
    if (this.arr.length == 0) {
      this.arr = []
      this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(this.arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(this.arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getGenericKind(port, lines) {
    this.arr = [];
    this.searchTree(port, 'data_type_or_implicit1'); // parameter_identifier, data_type_or_implicit1
    if (this.arr.length == 0) {
      this.arr = []
      return "";
    } else {
      var port_name = this.extractData(this.arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getEntityName(tree, lines) {
    this.arr = [];
    var element = tree;
    this.searchTree(element, 'module_header');
    element = this.arr
    this.arr = []
    this.searchTree(element[0], 'simple_identifier');
    let item = {
      "name": this.extractData(this.arr[0], lines),
      "index": this.index(this.arr[0])
    };
    return item
  }

  extractData(node, lines) {
    return lines[node.startPosition.row].substr(node.startPosition.column, node.endPosition.column - node.startPosition.column)
  }

  index(node) {
    return [node.startPosition.row, node.startPosition.column]
  }

  fileLines(source) {
    var array = source.toString().split(os.EOL);
    return array
  }
}
module.exports = tsVerilogParser
