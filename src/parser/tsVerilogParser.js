// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

const fs = require('fs');
const os = require("os");
const path = require('path');
// var Parser = []
// var VerilogParser = []
if (process.platform !== "win32") {
  Parser = require('tree-sitter');
  VerilogParser = require('tree-sitter-verilog');
}

class tsVerilogParser  {
  constructor(comment_symbol) {
    this.parser = new Parser();
    this.parser.setLanguage(VerilogParser);
    this.comment_symbol = comment_symbol
  }

  getAll(sourceCode) {
    var lines = this.fileLines(sourceCode)
    const tree = this.parser.parse(sourceCode);
    // fs.writeFile("tree.json", tree.rootNode, function(err) {  });
    var structure = {
      'libraries': this.get_libraries(tree.rootNode, lines),  // includes
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
    var arr_match = [];
    function recursive_searchTree(element, matchingTitle) {
      if (element.type == matchingTitle) {
        arr_match.push(element);
      } else if (element != null) {
        var i;
        var result = null;
        for (i = 0; result == null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matchingTitle);
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matchingTitle);
    return arr_match;
  }

  getPortName(port, lines) {
    var arr = this.searchTree(port, 'list_of_variable_identifiers');
    if (arr.length == 0) {
      arr = this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getPortNameAnsi(port, lines) {
    var arr = this.searchTree(port, 'port_identifier');
    if (arr.length == 0) {
      arr = this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getPortType(port, lines) {
    var arr = this.searchTree(port, 'net_port_type1');
    if (arr[0] == null) {
      return "";
    }
    var port_type = this.extractData(arr[0], lines)
    return port_type;
  }

  getPortKind(port, lines) {
    var arr = this.searchTree(port, 'port_direction');
    if (arr[0] == null) {
      return;
    }
    var port_type = this.extractData(arr[0], lines)
    return port_type;
  }

  addPort(element, key, name, direction, type, ansi, items, comments, lines) {
    var item = {};
    var inputs = [];
    var arr = this.searchTree(element, key);
    inputs = arr;
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
      var port_ref = this.searchTree(element, 'port_reference');
      var comment = "";
      var comment_str = comments[inputs[x].startPosition.row];
      for (var i = 0; i < port_name.length; i++) {
        if (comment_str == undefined ){
          for (var z = 0; z < port_ref.length; z++) {
            var port_ref_name = this.extractData(port_ref[z],lines);
            if(port_ref_name == port_name[i].trim()){
              var pre_comment =  comments[port_ref[z].startPosition.row];
              if (pre_comment != undefined) {
                if (this.comment_symbol == "" ||  pre_comment[0] == this.comment_symbol){
                  comment = pre_comment.substring(1);
                }else {
                  comment = "";
                }
            }
          }
        }
      }
        else if (this.comment_symbol == "" ||  comment_str[0] == this.comment_symbol)
          comment = comment_str.substring(1);

        item = {
          'name': port_name[i],
          'direction': ((ansi == true) ? directionVar : direction),
          'type': typeVar,
          "index": this.index(inputs[x]),
          "comment": comment
        }
        items.push(item);
      }
    }
    return items
  }

  getPorts(tree, lines) {
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
    var arr = this.searchTree(tree, 'comment');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      item[inputs[x].startPosition.row] = this.extractData(inputs[x], lines).substr(2)
    }
    return item
  }

  get_libraries(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'include_compiler_directive');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      item = {
        "name": this.get_library_name(inputs[x], lines),
      }
      items.push(item);
    }
    return items
  }

  getGenerics(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //comments
    let comments = this.getComments(element, lines);
    //Inputs
    var arr = this.searchTree(element, 'parameter_declaration');
    if (arr == null) {
      arr = this.searchTree(element, 'parameter_port_declaration');
    }
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = ""
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" ||  pre_comment[0] == this.comment_symbol){
          comment = pre_comment.substring(1);
        }else {
          comment = "";
        }
      }
      item = {
        "name": this.getGenericName(inputs[x], lines),
        "type": this.getGenericKind(inputs[x], lines),
        "index": this.index(inputs[x]),
        "comment": comment
      }
      items.push(item);
    }
    return items
  }

  get_library_name(port, lines) {
    var arr = this.searchTree(port, 'double_quoted_string');
    if (arr.length == 0) {
      var lib = this.extractData(arr[0], lines)
      return lib;
    } else {
      var lib = this.extractData(arr[0], lines).substr(1,this.extractData(arr[0], lines).length - 2);
      var split_lib = lib.split(',')
      for (var x = 0; x < split_lib.length; ++x)
        return lib;
    }
  }

  getGenericName(port, lines) {
    var arr = this.searchTree(port, 'list_of_variable_identifiers');
    if (arr.length == 0) {
      arr = this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines)
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getGenericKind(port, lines) {
    var arr = this.searchTree(port, 'data_type_or_implicit1'); // parameter_identifier, data_type_or_implicit1
    if (arr.length == 0) {
      return "";
    } else {
      var port_name = this.extractData(arr[0], lines)
      var split_port_name = port_name.split(',')
      for (var x = 0; x < split_port_name.length; ++x)
        return port_name;
    }
  }

  getEntityName(tree, lines) {
    var element = tree;
    var arr = this.searchTree(element, 'module_header');
    element = arr
    var arr = this.searchTree(element[0], 'simple_identifier');
    var module_index = this.index(arr[0]);
    let item = {
      "name": this.extractData(arr[0], lines),
      "comment": "",
      "index": module_index
    };

    var description = "";
    var comments = this.searchTree(tree, 'comment');
    for (var x=0; x< comments.length; ++x){
      if (comments[x].startPosition.row >= module_index[0])
        break;
      var comment_str = this.extractData(comments[x], lines).substr(2) + '\n ';
      if (this.comment_symbol == "" ||  comment_str[0] == this.comment_symbol)
        description += comment_str.substring(1);
    }
    description += '\n';
    item["comment"] = description;

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
