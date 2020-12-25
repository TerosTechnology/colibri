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
const Parser = require('web-tree-sitter');
const ts_base_parser = require('./ts_base_parser');

class tsVerilogParser extends ts_base_parser.Ts_base_parser {
  constructor(comment_symbol) {
    super();
    this.comment_symbol = comment_symbol;
    this.loaded_wasm = false;
  }

  async init() {
    await Parser.init();
    this.parser = new Parser();
    let Lang = await Parser.Language.load(path.join(__dirname, path.sep + "parsers" + path.sep + "tree-sitter-verilog.wasm"));
    this.parser.setLanguage(Lang);
    this.loaded_wasm = true;
  }

  async getAll(sourceCode, comment_symbol) {
    let structure;
    if (comment_symbol !== undefined) {
      this.comment_symbol = comment_symbol;
    }
    try {
      var lines = this.fileLines(sourceCode);
      const tree = await this.parser.parse(sourceCode);
      //comments
      let comments = this.getComments(tree.rootNode, lines);
      var module_header = this.search_multiple_in_tree(tree.rootNode, 'module_header');

      if (module_header.length === 0) {
        let arch_body = tree;
        let body_elements = this.get_body_elements_and_declarations(arch_body, lines, comments, true);

        structure = {
          "package": this.get_package_declaration(tree.rootNode, lines), // package_identifier 
          "declarations": {
            'types': body_elements.types,
            'signals': body_elements.signals,
            'constants': body_elements.constants,
            'functions': body_elements.functions
          }
        };
      } else {
        let arch_body = this.get_architecture_body(tree);
        let body_elements = this.get_body_elements_and_declarations(arch_body, lines, comments);

        structure = {
          'libraries': this.get_libraries(tree.rootNode, lines, comments),  // includes
          "entity": this.getEntityName(tree.rootNode, lines), // module
          "generics": this.getGenerics(tree.rootNode, lines, comments), // parameters
          "ports": this.getPorts(tree.rootNode, lines, comments),
          "body": {
            'processes': body_elements.processes,
            'instantiations': body_elements.instantiations,
          },
          "declarations": {
            'types': body_elements.types,
            'signals': body_elements.signals,
            'constants': body_elements.constants,
            'functions': body_elements.functions
          }
        };
      }
      return structure;
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return undefined;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  get_body_elements_and_declarations(arch_body, lines, general_comments, enable_package) {
    if (this.comment_symbol === '') {
      this.comment_symbol = ' ';
    }
    //Elements array
    let process_array = [];
    let signals_array = [];
    let constants_array = [];
    let functions_array = [];
    let types_array = [];
    let instantiations_array = [];

    let cursor = arch_body.walk();
    let comments = '';
    // Process
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'module_or_generate_item' || cursor.nodeType === 'package_item') {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'always_construct') {
            let new_processes = this.get_processes(cursor.currentNode(), lines, general_comments);
            new_processes = this.set_description_to_array(new_processes, comments);
            process_array = process_array.concat(new_processes);
            comments = '';
          }
          else if (cursor.nodeType === 'local_parameter_declaration') {
            let new_constants = this.get_constants(cursor.currentNode(), lines, general_comments);
            new_constants = this.set_description_to_array(new_constants, comments);
            constants_array = constants_array.concat(new_constants);
            comments = '';
          }
          else if (cursor.nodeType === 'net_declaration' || cursor.nodeType === 'data_declaration') {
            let new_signals = this.get_signals(cursor.currentNode(), lines, general_comments);
            new_signals = this.set_description_to_array(new_signals, comments);
            signals_array = signals_array.concat(new_signals);
            comments = '';
          }
          else if (cursor.nodeType === 'function_identifier') {
            let new_functions = this.get_functions(cursor.currentNode(), lines, general_comments);
            new_functions = this.set_description_to_array(new_functions, comments);
            functions_array = functions_array.concat(new_functions);
            comments = '';
          }
          else if (cursor.nodeType === 'type_declaration') {
            let new_types = this.get_types_pkg(cursor.currentNode(), lines, general_comments);
            new_types = this.set_description_to_array(new_types, comments);
            types_array = types_array.concat(new_types);
            comments = '';
          }
          else if (cursor.nodeType === 'module_instantiation') {
            let new_instantiations = this.get_instantiations(cursor.currentNode(), lines, general_comments);
            new_instantiations = this.set_description_to_array(new_instantiations, comments);
            instantiations_array = types_array.concat(new_instantiations);
            comments = '';
          }
          else {
            comments = '';
          }
        }
        while (cursor.gotoNextSibling() !== false);
        cursor.gotoParent();
      }
      else if (cursor.nodeType === 'comment') {
        let txt_comment = cursor.nodeText.slice(2);
        if (txt_comment[0] === this.comment_symbol) {
          comments += txt_comment.slice(1).trim() + '\n';
        }
        else {
          comments = '';
        }
      }
      else {
        comments = '';
      }
    }
    while (cursor.gotoNextSibling() !== false);

    if (enable_package === true) {
      constants_array = constants_array.concant(constants_array);
    }

    return {
      processes: process_array, signals: signals_array, instantiations: instantiations_array,
      constants: constants_array, functions: functions_array, types: types_array
    };
  }

  get_architecture_body(p) {
    let break_p = false;
    let arch_body = undefined;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'module_declaration') {
        arch_body = cursor.currentNode();
        break_p = true;
      }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return arch_body;
  }

  set_description_to_array(arr, txt) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].description === '') {
        arr[i].description = txt;
      }
    }
    return arr;
  }

  // get_architecture_body(p) {
  //   let break_p = false;
  //   let arch_body = undefined;
  //   let cursor = p.walk();
  //   cursor.gotoFirstChild();
  //   do {
  //     if (cursor.nodeType === 'module_declaration') {
  //       arch_body = cursor.currentNode();
  //       break_p = true;
  //     }
  //   }
  //   while (cursor.gotoNextSibling() === true && break_p === false);
  //   return arch_body;
  // }
  //////////////////////////////////////////////////////////////////////////////
  get_process_label(p) {
    let label_txt = '';
    let label = this.get_item_from_childs(p, "block_identifier");
    if (label === undefined) {
      label_txt = 'unnamed';
    }
    else {
      label_txt = label.text;
    }
    return label_txt;
  }

  get_deep_process(p) {
    let statement = this.get_item_from_childs(p, 'statement');
    let statement_item = this.get_item_from_childs(statement, 'statement_item');
    let procedural_timing_control_statement =
      this.get_item_from_childs(statement_item, 'procedural_timing_control_statement');
    let statement_or_null = this.get_item_from_childs(procedural_timing_control_statement, 'statement_or_null');
    let statement_2 = this.get_item_from_childs(statement_or_null, 'statement');
    let statement_item_2 = this.get_item_from_childs(statement_2, 'statement_item');
    let seq_block = this.get_item_from_childs(statement_item_2, 'seq_block');
    return seq_block;
  }

  getPortName(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'list_of_port_identifiers');
    var port_name;
    if (arr.length == 0) {
      arr = this.search_multiple_in_tree(port, 'list_of_variable_identifiers');
    }
    if (arr.length == 0) {
      arr = this.search_multiple_in_tree(port, 'port_identifier');
    }
    for (var x = 0; x < arr.length; ++x) {
      if (x === 0) {
        port_name = this.extractData(arr[x], lines);
      } else {
        port_name = port_name + ',' + this.extractData(arr[x], lines);
      }
    }
    return port_name;
  }

  getPortNameAnsi(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'port_identifier');
    if (arr.length == 0) {
      arr = this.search_multiple_in_tree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines);
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  getPortType(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'net_port_type1');
    if (arr[0] == null) {
      arr = this.search_multiple_in_tree(port, 'packed_dimension');
    }
    if (arr[0] == null) {
      return "";
    }
    var port_type = this.extractData(arr[0], lines);
    return port_type;
  }

  getPortKind(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'port_direction');
    if (arr[0] == null) {
      return;
    }
    var port_type = this.extractData(arr[0], lines);
    return port_type;
  }

  addPort(element, key, name, direction, type, ansi, items, comments, lines) {
    let last_direction = undefined;
    var item = {};
    var inputs = [];
    var arr = this.search_multiple_in_tree(element, key);
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
      if (directionVar !== undefined) {
        last_direction = directionVar;
      }
      var typeVar;
      switch (type) {
        case 'getPortType':
          typeVar = this.getPortType(inputs[x], lines);
          break;
        default:
          typeVar = this.getPortType(inputs[x], lines);
      }
      var port_ref = this.search_multiple_in_tree(element, 'port_reference');
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

        if (directionVar === undefined) {
          directionVar = last_direction;
        }

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
    var arr = this.search_multiple_in_tree(tree, 'comment');
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
    var arr = this.search_multiple_in_tree(element, 'parameter_declaration');
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
    var arr = this.search_multiple_in_tree(port, 'double_quoted_string');
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
    var arr = this.search_multiple_in_tree(port, 'list_of_variable_identifiers');
    if (arr.length == 0) {
      arr = this.search_multiple_in_tree(port, 'simple_identifier');
      var port_name = this.extractData(arr[0], lines);
      return port_name;
    } else {
      var port_name = this.extractData(arr[0], lines);
      var split_port_name = port_name.split(',');
      for (var x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  get_generic_default(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'constant_param_expression');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_value = this.extractData(arr[0], lines);
    return input_value;
  }

  get_always_name(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'block_identifier');
    if (arr.length == 0) {
      var name = "unnamed";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_always_sens_list(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'event_control');
    if (arr.length == 0) {
      var name = '';
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_instantiation_name(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'name_of_instance');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_type_type(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'interface_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_type_type_pkg(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'data_type');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }
  get_signal_type(input, lines, command) {
    var arr = this.search_multiple_in_tree(input, command);
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  get_type_name(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'list_of_interface_identifiers');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_type_name_pkg(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'type_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_port_default(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'list_of_interface_identifiers');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_signal_name(input, lines, command) {
    var arr = this.search_multiple_in_tree(input, command);
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_name(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'parameter_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_type(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'integer_atom_type');
    if (arr.length == 0) {
      var name = '';
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_constant_default(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'constant_param_expression');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_function_name(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'simple_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var input_name = this.extractData(arr[0], lines);
    return input_name;
  }

  get_instantiation_type(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'simple_identifier');
    if (arr.length == 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extractData(arr[0], lines);
    return always_name;
  }

  getGenericKind(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'data_type_or_implicit1');
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
    var arr = this.search_multiple_in_tree(element, 'module_header');
    element = arr;
    var arr = this.search_multiple_in_tree(element[0], 'simple_identifier');
    var module_index = this.index(arr[0]);
    let item = {
      "name": this.extractData(arr[0], lines),
      "description": ""
    };

    var description = "";
    var comments = this.search_multiple_in_tree(tree, 'comment');
    for (var x = 0; x < comments.length; ++x) {
      if (comments[x].startPosition.row >= module_index[0]) { break; }
      var comment_str = this.extractData(comments[x], lines).substr(2) + '\n ';
      if (this.comment_symbol == "" || comment_str[0] == this.comment_symbol) { description += comment_str.substring(1); }
    }
    description += '\n';
    item["description"] = description;

    return item;
  }

  get_package_declaration(tree, lines) {
    var element = tree;
    var arr = this.search_multiple_in_tree(element, 'package_identifier');
    element = arr;
    arr = this.search_multiple_in_tree(element[0], 'simple_identifier');
    var module_index = this.index(arr[0]);
    let item = {
      "name": this.extractData(arr[0], lines),
      "description": ""
    };

    var description = "";
    var comments = this.search_multiple_in_tree(tree, 'comment');
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
    var arr = this.search_multiple_in_tree(element, 'always_construct');
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
      var arr1 = this.get_deep_process(inputs[x]);
      item = {
        "name": this.get_process_label(arr1),
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
    var arr = this.search_multiple_in_tree(element, 'module_instantiation');
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
    var arr = this.search_multiple_in_tree(element, 'interface_port_declaration'); //port_declaration
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

  get_types_pkg(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'type_declaration'); //port_declaration
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
        "name": this.get_type_name_pkg(inputs[x], lines),
        "type": this.get_type_type_pkg(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }

  get_signals(tree, lines, comments) {
    var items = [];
    var inputs = [];
    var inputs2 = [];
    var element = tree;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'net_declaration');
    var arr2 = this.search_multiple_in_tree(element, 'data_declaration');
    inputs = arr;
    inputs2 = arr2;

    this.get_signal_array(inputs, comments, items, lines, 'list_of_net_decl_assignments', 'net_type', 'packed_dimension');

    this.get_signal_array(inputs2, comments, items, lines, 'list_of_variable_decl_assignments', 'data_type_or_implicit1', 0);
    return items;
  }

  get_signal_array(inputs, comments, items, lines, name_command, type_command, type_dim) {
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
      let signal_type = this.get_signal_type(inputs[x], lines, type_command);
      let signal_type_dim = this.get_signal_type(inputs[x], lines, type_dim);
      if (signal_type_dim != 'undefined') {
        signal_type = signal_type + ' ' + signal_type_dim;
      }
      for (var s = 0; s < split_name_signal.length; ++s) {
        var name_signal = split_name_signal[s];
        item = {
          "name": name_signal.trim(),
          "type": signal_type,
          "description": comment
        };
        if (signal_type !== 'undefined') {
          items.push(item);
        }
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
    var arr = this.search_multiple_in_tree(element, 'local_parameter_declaration');
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
      var arr2 = this.search_multiple_in_tree(inputs[x], 'param_assignment');
      for (var x2 = 0; x2 < arr2.length; ++x2) {
        item = {
          "name": this.get_constant_name(arr2[x2], lines),
          "type": this.get_constant_type(inputs[x], lines),
          "default_value": this.get_constant_default(arr2[x2], lines),  // constant_param_expression
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
    var arr = this.search_multiple_in_tree(element, 'function_identifier');
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