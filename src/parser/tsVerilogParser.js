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

const os = require("os");
const path = require('path');
// var Parser = []
// var VerilogParser = []
// if (process.platform !== "win32") {
//   Parser = require('web-tree-sitter');
//   VerilogParser = Parser.Language.load('/home/carlos/repo/colibri/src/parser/parsers/tree-sitter-verilog.wasm');
// }
const Parser = require('web-tree-sitter');
const initParser = Parser.init();

class tsVerilogParser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol;
    this.loaded_wasm = false;
  }

  async getAll(sourceCode) {
    try {
      await initParser;
      this.parser = new Parser();
      if (this.loaded_wasm === false) {
        let Lang = await Parser.Language.load(path.join(__dirname, path.sep + "parsers" + path.sep + "tree-sitter-verilog.wasm"));
        this.parser.setLanguage(Lang);
        this.loaded_wasm = true;
      }
      var lines = this.fileLines(sourceCode);
      const tree = await this.parser.parse(sourceCode);
      //comments
      let comments = this.getComments(tree, lines);

      var structure = {
        'libraries': this.get_libraries(tree.rootNode, lines, comments),  // includes
        "entity": this.getEntityName(tree.rootNode, lines, comments), // module
        "generics": this.getGenerics(tree.rootNode, lines, comments), // parameters
        "ports": this.getPorts(tree.rootNode, lines, comments),
        "body": {
          'processes': this.get_processes(tree.rootNode, lines, comments),
          'instantiations': this.get_instantiations(tree.rootNode, lines, comments)
        },
        "declarations": {
          'types': this.get_types(tree.rootNode, lines, comments),
          'signal': this.get_signals(tree.rootNode, lines, comments),
          'constants': this.get_constants(tree.rootNode, lines, comments),
          'functions': this.get_functions(tree.rootNode, lines, comments)
        }
      };
      // console.log(structure.generics);
      // console.log(structure.ports);
      // console.log(structure.body);
      // console.log(structure.declarations);
      return structure;
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return undefined;
    }
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
      var port_name = this.extractData(arr[0], lines);
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  getPortNameAnsi(port, lines) {
    var arr = this.searchTree(port, 'port_identifier');
    if (arr.length == 0) {
      arr = this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines);
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  getPortType(port, lines) {
    var arr = this.searchTree(port, 'net_port_type1');
    if (arr[0] == null) {
      arr = this.searchTree(port, 'packed_dimension');
    }
    if (arr[0] == null) {
      return "";
    }
    var port_type = this.extractData(arr[0], lines);
    return port_type;
  }

  getPortKind(port, lines) {
    var arr = this.searchTree(port, 'port_direction');
    if (arr[0] == null) {
      return;
    }
    var port_type = this.extractData(arr[0], lines);
    return port_type;
  }

  addPort(element, key, name, direction, type, ansi, items, comments, lines) {
    var item = {};
    var inputs = [];
    var arr = this.searchTree(element, key);
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      var port_name;
      switch (name) {
        case 'getPortName':
          port_name = this.getPortName(inputs[x], lines);
          break;
        case 'getPortNameAnsi':
          port_name = this.getPortNameAnsi(inputs[x], lines);
          break;
        default:
          name = this.getPortName;
      }
      port_name = port_name.split(',');
      var directionVar = this.getPortKind(inputs[x], lines);
      var typeVar;
      switch (type) {
        case 'getPortType':
          typeVar = this.getPortType(inputs[x], lines);
          break;
        default:
          typeVar = this.getPortType(inputs[x], lines);
      }
      var port_ref = this.searchTree(element, 'port_reference');
      var comment = "";
      var comment_str = comments[inputs[x].startPosition.row];
      for (var i = 0; i < port_name.length; i++) {
        if (comment_str == undefined) {
          for (var z = 0; z < port_ref.length; z++) {
            var port_ref_name = this.extractData(port_ref[z], lines);
            if (port_ref_name == port_name[i].trim()) {
              var pre_comment = comments[port_ref[z].startPosition.row];
              if (pre_comment != undefined) {
                if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
                  comment = pre_comment.substring(1);
                } else {
                  comment = "";
                }
              }
            }
          }
        }
        else if (this.comment_symbol == "" || comment_str[0] == this.comment_symbol) { comment = comment_str.substring(1); }

        item = {
          'name': port_name[i],
          'direction': ((ansi == true) ? directionVar : direction),
          'type': typeVar,
          "default_value": "",
          "description": comment
        };
        items.push(item);
      }
    }
    return items;
  }

  getPorts(tree, lines, comments) {
    var items = [];
    var element = tree;
    //Inputs
    items = this.addPort(element, 'input_declaration', 'getPortName', 'input', 'getPortType', false, items, comments, lines);
    //Outputs
    items = this.addPort(element, 'output_declaration', 'getPortName', 'output', 'getPortType', false, items, comments, lines);
    //ansi_port_declaration
    items = this.addPort(element, 'ansi_port_declaration', 'getPortNameAnsi', 'getPortKind', 'getPortType', true, items, comments, lines);
    //inouts
    items = this.addPort(element, 'inout_declaration', 'getPortName', "inout", 'getPortType', false, items, comments, lines);
    return items;
  }

  getComments(tree, lines) {
    var item = {};
    var inputs = [];
    var arr = this.searchTree(tree, 'comment');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      item[inputs[x].startPosition.row] = this.extractData(inputs[x], lines).substr(2);
    }
    return item;
  }

  get_libraries(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //fix bug
    return items;

  }

  getGenerics(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'parameter_port_declaration');
    if (arr.length === 0) {
      arr = this.searchTree(element, 'parameter_declaration');
    }
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      item = {
        "name": this.getGenericName(inputs[x], lines),
        "type": this.getGenericKind(inputs[x], lines),
        "default_value": this.get_generic_default(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }

  get_library_name(port, lines) {
    var arr = this.searchTree(port, 'double_quoted_string');
    if (arr.length == 0) {
      var lib = this.extractData(arr[0], lines);
      return lib;
    } else {
      var lib = this.extractData(arr[0], lines).substr(1, this.extractData(arr[0], lines).length - 2);
      var split_lib = lib.split(',');
      for (var x = 0; x < split_lib.length; ++x) { return lib; }
    }
  }

  getGenericName(port, lines) {
    var arr = this.searchTree(port, 'list_of_variable_identifiers');
    if (arr.length == 0) {
      arr = this.searchTree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines);
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  get_generic_default(input, lines) {
    var arr = this.searchTree(input, 'constant_param_expression'); //param_assignment //constant_primary
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_value = this.extractData(arr[0], lines);
    return input_value;
  }

  get_always_name(always, lines) {
    var arr = this.searchTree(always, 'always_identifier');
    if (arr.length == 0) {
      var name = "unnamed";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_always_sens_list(always, lines) {
    var arr = this.searchTree(always, 'event_control');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_instantiation_name(always, lines) {
    var arr = this.searchTree(always, 'name_of_instance');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_type_type(input, lines) {
    var arr = this.searchTree(input, 'interface_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_signal_type(input, lines, command) {
    var arr = this.searchTree(input, command);
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_type_name(input, lines) {
    var arr = this.searchTree(input, 'list_of_interface_identifiers');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_port_default(input, lines) {
    var arr = this.searchTree(input, 'list_of_interface_identifiers');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_signal_name(input, lines, command) {
    var arr = this.searchTree(input, command);
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_name(input, lines) {
    var arr = this.searchTree(input, 'simple_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_type(input, lines) {
    var arr = this.searchTree(input, 'integer_atom_type');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_default(input, lines) {
    var arr = this.searchTree(input, 'constant_param_expression');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_function_name(input, lines) {
    var arr = this.searchTree(input, 'simple_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_instantiation_type(always, lines) {
    var arr = this.searchTree(always, 'simple_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  getGenericKind(port, lines) {
    var arr = this.searchTree(port, 'data_type_or_implicit1'); // parameter_identifier, data_type_or_implicit1
    if (arr.length == 0) {
      return "";
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  getEntityName(tree, lines) {
    var element = tree;
    var arr = this.searchTree(element, 'module_header');
    element = arr;
    var arr = this.searchTree(element[0], 'simple_identifier');
    var module_index = this.index(arr[0]);
    let item = {
      "name": this.extractData(arr[0], lines),
      "description": ""
    };

    var description = "";
    var comments = this.searchTree(tree, 'comment');
    for (var x = 0; x < comments.length; ++x) {
      if (comments[x].startPosition.row >= module_index[0]) { break; }
      var comment_str = this.extractData(comments[x], lines).substr(2) + '\n ';
      if (this.comment_symbol == "" || comment_str[0] == this.comment_symbol) { description += comment_str.substring(1); }
    }
    description += '\n';
    item["description"] = description;

    return item;
  }

  get_processes(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'always_construct');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      item = {
        "name": this.get_always_name(inputs[x], lines),  // "always_block",
        "sens_list": this.get_always_sens_list(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }

  get_instantiations(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'module_instantiation');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      item = {
        "name": this.get_instantiation_name(inputs[x], lines),
        "type": this.get_instantiation_type(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }

  get_types(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'port_declaration'); //port_declaration
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      var arr_types = this.get_type_name(inputs[x], lines);
      var split_arr_types = arr_types.split(',');
      for (var s = 0; s < split_arr_types.length; ++s) {
        var name_type = split_arr_types[s];
        item = {
          "name": name_type.trim(),
          "type": this.get_type_type(inputs[x], lines),
          "description": comment
        };
        items.push(item);
      }
    }
    return items;
  }

  get_signals(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'net_declaration'); //port_declaration // list_of_net_decl_assignments // net_declaration // module_or_generate_item // data_declaration
    var arr2 = this.searchTree(element, 'data_declaration');
    inputs = arr;

    this.get_signal_array(inputs, comments, items, lines, 'list_of_net_decl_assignments', 'net_type');

    this.get_signal_array(arr2, comments, items, lines, 'list_of_variable_decl_assignments', 'data_type_or_implicit1');
    return items;
  }

  get_signal_array(inputs, comments, items, lines, name_command, type_command) {
    var item = {};
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      var arr_signals = this.get_signal_name(inputs[x], lines, name_command);
      var split_name_signal = arr_signals.split(',');
      for (var s = 0; s < split_name_signal.length; ++s) {
        var name_signal = split_name_signal[s];
        item = {
          "name": name_signal.trim(),
          "type": this.get_signal_type(inputs[x], lines, type_command),
          "description": comment
        };
        items.push(item);
      }
    }
    return items;
  }

  get_constants(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'local_parameter_declaration'); //port_declaration
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      var arr_signals = this.get_constant_name(inputs[x], lines);
      var split_name_signal = arr_signals.split(',');
      for (var s = 0; s < split_name_signal.length; ++s) {
        var name_signal = split_name_signal[s];
        item = {
          "name": name_signal,
          "type": this.get_constant_type(inputs[x], lines),
          "default_value": this.get_constant_default(inputs[x], lines),  // constant_param_expression
          "description": comment
        };
        items.push(item);
      }
    }
    return items;
  }

  get_functions(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.searchTree(element, 'function_identifier'); //port_declaration
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment != undefined) {
        if (this.comment_symbol == "" || pre_comment[0] == this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      item = {
        "name": this.get_function_name(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }

  extractData(node, lines) {
    return lines[node.startPosition.row].substr(node.startPosition.column, node.endPosition.column - node.startPosition.column);
  }

  index(node) {
    return [node.startPosition.row, node.startPosition.column];
  }

  fileLines(source) {
    var array = source.toString().split("\n");
    return array;
  }
}
module.exports = tsVerilogParser;
