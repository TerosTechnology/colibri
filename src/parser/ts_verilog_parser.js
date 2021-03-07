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

const path = require('path');
const ts_base_parser = require('./ts_base_parser');

class Parser extends ts_base_parser.Ts_base_parser {
  constructor(comment_symbol) {
    super();
    this.comment_symbol = comment_symbol;
    this.loaded = false;
  }

  async init() {
    try{
      const Tree_sitter = require('web-tree-sitter');
      await Tree_sitter.init();
      this.parser = new Tree_sitter();
      let Lang = await Tree_sitter.Language.load(path.join(__dirname, path.sep +
        "parsers" + path.sep + "tree-sitter-verilog.wasm"));
      this.parser.setLanguage(Lang);
      this.loaded = true;
    }
    catch(e){console.log(e);}
  }

  async get_all(sourceCode, comment_symbol) {
    if (this.loaded === false){
      return undefined;
    }
    let structure;
    let file_type;
    if (comment_symbol !== undefined) {
      this.comment_symbol = comment_symbol;
    }
    try {
      var lines = this.fileLines(sourceCode);
      const tree = await this.parser.parse(sourceCode);
      //comments
      let comments = this.get_comments(tree.rootNode, lines);
      var module_header = this.search_multiple_in_tree(tree.rootNode, 'module_header');

      if (module_header.length === 0) {
        let arch_body = tree;
        let body_elements = this.get_body_elements_and_declarations(arch_body, lines, comments, true);
        file_type = "package";

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
        file_type = "entity";

        structure = {
          'libraries': this.get_libraries(tree.rootNode, lines, comments),  // includes
          "entity": this.get_entityName(tree.rootNode, lines), // module
          "generics": body_elements.generics, // parameters
          "ports": body_elements.ports,
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
      structure =  this.parse_doxy(structure,file_type);
      structure =  this.parse_mermaid(structure,file_type);
      if (file_type === "entity"){
        structure = this.parse_ports_group(structure);
        structure = this.parse_virtual_bus(structure);
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
    let last_element_position = -1;
    //Elements array
    let process_array = [];
    let signals_array = [];
    let constants_array = [];
    let functions_array = [];
    let types_array = [];
    let instantiations_array = [];
    let ports_array = [];
    let generics_array = [];

    let cursor = arch_body.walk();
    let comments = '';
    // Process
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'module_or_generate_item' || cursor.nodeType === 'package_item') {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'always_construct') {
            last_element_position = cursor.startPosition.row;
            let new_processes = this.get_processes(cursor.currentNode(), lines, general_comments);
            comments = comments.replace(/fsm_extract/g, '');
            new_processes = this.set_description_to_array(new_processes, comments, general_comments);
            process_array = process_array.concat(new_processes);
            comments = '';
          }
          else if (cursor.nodeType === 'net_declaration' || cursor.nodeType === 'data_declaration') {
            last_element_position = cursor.startPosition.row;
            let new_signals = this.get_signals(cursor.currentNode(), lines, general_comments);
            new_signals = this.set_description_to_array(new_signals, comments, general_comments);
            signals_array = signals_array.concat(new_signals);

            if (new_signals.length === 0 && enable_package === true || enable_package === undefined) {
              let new_types = this.get_types_pkg(cursor.currentNode(), lines, general_comments);
              new_types = this.set_description_to_array(new_types, comments, general_comments);
              types_array = types_array.concat(new_types);
            }
            comments = '';
          }
          else if (cursor.nodeType === 'function_identifier') {
            last_element_position = cursor.startPosition.row;
            let new_functions = this.get_functions(cursor.currentNode(), lines, general_comments);
            new_functions = this.set_description_to_array(new_functions, comments, general_comments);
            functions_array = functions_array.concat(new_functions);
            comments = '';
          }
          else if (cursor.nodeType === 'any_parameter_declaration') {
            last_element_position = cursor.startPosition.row;
            let new_constants = this.get_constants(cursor.currentNode(), lines, general_comments);
            new_constants = this.set_description_to_array(new_constants, comments, general_comments);
            constants_array = constants_array.concat(new_constants);

            if (new_constants.length === 0) {
              let new_generics = this.get_generics(cursor.currentNode(), lines, general_comments, 0);
              new_generics = this.set_description_to_array(new_generics, comments, general_comments);
              generics_array = generics_array.concat(new_generics);
            }
            if (new_constants.length === 0 && enable_package === true) {
              new_constants = this.get_generics(cursor.currentNode(), lines, general_comments, 0);
              new_constants = this.set_description_to_array(new_constants, comments, general_comments);
              constants_array = constants_array.concat(new_constants);
            }

            comments = '';
          }
          else if (cursor.nodeType === 'type_declaration') {
            last_element_position = cursor.startPosition.row;
            let new_types = this.get_types_pkg(cursor.currentNode(), lines, general_comments);
            new_types = this.set_description_to_array(new_types, comments, general_comments);
            types_array = types_array.concat(new_types);
            comments = '';
          }
          else if (cursor.nodeType === 'module_instantiation') {
            last_element_position = cursor.startPosition.row;
            let new_instantiations = this.get_instantiations(cursor.currentNode(), lines, general_comments);
            new_instantiations = this.set_description_to_array(new_instantiations, comments, general_comments);
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
      else if (cursor.nodeType === 'module_ansi_header') {
        let new_ports = this.get_ansi_ports(cursor.currentNode(), lines, general_comments);
        ports_array = ports_array.concat(new_ports);

        let new_generics = this.get_ansi_generics(cursor.currentNode(), lines, general_comments);
        generics_array = generics_array.concat(new_generics);

        let new_constants = this.get_ansi_constants(cursor.currentNode(), lines, general_comments);
        constants_array = constants_array.concat(new_constants);
        comments = '';
      }
      else if (cursor.nodeType === 'port_declaration') {
        last_element_position = cursor.startPosition.row;
        let new_ports = this.get_ports(cursor.currentNode(), lines, general_comments);
        new_ports = this.set_description_to_array(new_ports, comments, general_comments);
        ports_array = ports_array.concat(new_ports);
        comments = '';
        last_element_position = cursor.startPosition.row;
        let new_signals = this.get_types(cursor.currentNode(), lines, general_comments);
        new_signals = this.set_description_to_array(new_signals, comments, general_comments);
        signals_array = signals_array.concat(new_signals);
        comments = '';
      }
      else if (cursor.nodeType === 'parameter_declaration') {
        last_element_position = cursor.startPosition.row;
        let new_generics = this.get_generics(cursor.currentNode(), lines, general_comments, 0);
        new_generics = this.set_description_to_array(new_generics, comments, general_comments);
        generics_array = generics_array.concat(new_generics);
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let comment_position = cursor.startPosition.row;
        let txt_comment = cursor.nodeText.slice(2);
        if (txt_comment[0] === this.comment_symbol && last_element_position !== comment_position) {
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

    return {
      processes: process_array, signals: signals_array, instantiations: instantiations_array,
      ports: ports_array, generics: generics_array,
      constants: constants_array, functions: functions_array, types: types_array
    };
  }

  get_ansi_ports(p, lines, general_comments) {
    let last_comments = '';
    let last_element_position = -1;
    let ports_types = ['input_declaration', 'output_declaration', 'ansi_port_declaration',
      'inout_declaration'];

    let ports = [];
    let comments = '';

    let ports_list = this.get_item_from_childs(p, 'list_of_port_declarations');
    if (ports_list === undefined) {
      return ports;
    }

    let cursor = ports_list.walk();
    cursor.gotoFirstChild();
    do {
      if (ports_types.includes(cursor.nodeType) === true) {
        if (last_element_position === cursor.startPosition.row) {
          comments = last_comments;
        }
        else {
          last_comments = comments;
        }
        last_element_position = cursor.startPosition.row;

        let new_ports = this.get_ports(cursor.currentNode(), lines, general_comments);
        new_ports = this.set_description_to_array(new_ports, comments, general_comments);
        ports = ports.concat(new_ports);
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let txt_comment = cursor.nodeText.slice(2);
        let comment_position = cursor.startPosition.row;
        if (txt_comment[0] === this.comment_symbol && last_element_position !== comment_position) {
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
    return ports;
  }

  get_ansi_generics(p, lines, general_comments) {
    let last_element_position = -1;
    let generics_types = ['parameter_port_declaration'];
    let last_comments = '';

    let generics = [];
    let comments = '';

    let generics_list = this.get_item_from_childs(p, 'parameter_port_list');
    if (generics_list === undefined) {
      return generics;
    }

    let cursor = generics_list.walk();
    cursor.gotoFirstChild();
    do {
      if (generics_types.includes(cursor.nodeType) === true) {
        if (last_element_position === cursor.startPosition.row) {
          comments = last_comments;
        }
        else {
          last_comments = comments;
        }
        last_element_position = cursor.startPosition.row;

        let new_generics = this.get_generics(cursor.currentNode(), lines, general_comments, 1);
        new_generics = this.set_description_to_array(new_generics, comments, general_comments);
        generics = generics.concat(new_generics);
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let comment_position = cursor.startPosition.row;
        let txt_comment = cursor.nodeText.slice(2);
        if (txt_comment[0] === this.comment_symbol && last_element_position !== comment_position) {
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
    return generics;
  }

  get_ansi_constants(p, lines, general_comments) {
    let last_element_position = -1;
    let constants_types = ['parameter_port_declaration'];
    let last_comments = '';

    let constants = [];
    let comments = '';

    let constants_list = this.get_item_from_childs(p, 'parameter_port_list');
    if (constants_list === undefined) {
      return constants;
    }

    let cursor = constants_list.walk();
    cursor.gotoFirstChild();
    do {
      if (constants_types.includes(cursor.nodeType) === true) {
        if (last_element_position === cursor.startPosition.row) {
          comments = last_comments;
        }
        else {
          last_comments = comments;
        }
        last_element_position = cursor.startPosition.row;

        let new_constants = this.get_constants(cursor.currentNode(), lines, general_comments, 1);
        new_constants = this.set_description_to_array(new_constants, comments, general_comments);
        constants = constants.concat(new_constants);
        comments = '';
      }
      else if (cursor.nodeType === 'comment') {
        let comment_position = cursor.startPosition.row;
        let txt_comment = cursor.nodeText.slice(2);
        if (txt_comment[0] === this.comment_symbol && last_element_position !== comment_position) {
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
    return constants;
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

  set_description_to_array(arr, txt, general_comments) {
    for (let i = 0; i < arr.length; ++i) {
      let comment_candidate = general_comments[arr[i].start_line];
      if (comment_candidate !== undefined) {
        let result = this.check_comment(comment_candidate);
        if (result.check === true) {
          arr[i].description = result.comment;
        }
      }
      if (arr[i].description === '') {
        arr[i].description = txt;
      }
    }
    return arr;
  }

  check_comment(comment) {
    let check = false;
    let result = '';
    if (comment[0] === this.comment_symbol) {
      result = comment.slice(1).trim();
      check = true;
    }
    return { check: check, comment: result };
  }


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
    if (arr.length === 0) {
      arr = this.search_multiple_in_tree(port, 'list_of_variable_identifiers');
    }
    if (arr.length === 0) {
      arr = this.search_multiple_in_tree(port, 'port_identifier');
    }
    for (var x = 0; x < arr.length; ++x) {
      if (x === 0) {
        port_name = this.extract_data(arr[x], lines);
      } else {
        port_name = port_name + ',' + this.extract_data(arr[x], lines);
      }
    }
    return port_name;
  }

  getPortNameAnsi(port, lines) {
    let arr = this.search_multiple_in_tree(port, 'port_identifier');
    if (arr.length === 0) {
      arr = this.search_multiple_in_tree(port, 'simple_identifier');
      let port_name = this.extract_data(arr[0], lines);
      return port_name;
    } else {
      let port_name = this.extract_data(arr[0], lines);
      let split_port_name = port_name.split(',');
      for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
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
    var port_type = this.extract_data(arr[0], lines);
    return port_type;
  }

  getPortKind(port, lines) {
    var arr = this.search_multiple_in_tree(port, 'port_direction');
    if (arr[0] == null) {
      return;
    }
    var port_type = this.extract_data(arr[0], lines);
    return port_type;
  }

  add_port(element, key, name, direction, type, ansi, items, comments, lines) {
    let directionVar = undefined;
    let start_line = element.startPosition.row;
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
      directionVar = this.getPortKind(inputs[x], lines);
      if (directionVar !== undefined) {
        this.last_direction = directionVar;
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
        if (comment_str === undefined) {
          for (var z = 0; z < port_ref.length; z++) {
            var port_ref_name = this.extract_data(port_ref[z], lines);
            if (port_ref_name === port_name[i].trim()) {
              var pre_comment = comments[port_ref[z].startPosition.row];
              if (pre_comment !== undefined) {
                if (this.comment_symbol === "" || pre_comment[0] === this.comment_symbol) {
                  comment = pre_comment.substring(1);
                } else {
                  comment = "";
                }
              }
            }
          }
        }
        else if (this.comment_symbol === "" || comment_str[0] === this.comment_symbol) {
          comment = comment_str.substring(1);
        }

        if (directionVar === undefined) {
          directionVar = this.last_direction;
        }

        item = {
          'name': port_name[i],
          'direction': ((ansi === true) ? directionVar : direction),
          'type': typeVar,
          "default_value": "",
          "description": comment,
          "start_line": start_line
        };
        items.push(item);
      }
    }
    return items;
  }

  get_ports(tree, lines, comments) {
    var items = [];
    var element = tree;
    //Inputs
    items = this.add_port(element, 'input_declaration', 'getPortName',
      'input', 'getPortType', false, items, comments, lines);
    //Outputs
    items = this.add_port(element, 'output_declaration', 'getPortName',
      'output', 'getPortType', false, items, comments, lines);
    //ansi_port_declaration
    items = this.add_port(element, 'ansi_port_declaration', 'getPortNameAnsi',
      'getPortKind', 'getPortType', true, items, comments, lines);
    //inouts
    items = this.add_port(element, 'inout_declaration', 'getPortName', "inout",
      'getPortType', false, items, comments, lines);
    return items;
  }

  get_comments(tree, lines) {
    var item = {};
    var inputs = [];
    var arr = this.search_multiple_in_tree(tree, 'comment');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      item[inputs[x].startPosition.row] = this.extract_data(inputs[x], lines).substr(2);
    }
    return item;
  }

  get_libraries() {
    return [];
  }

  get_generics(tree, lines, comments, ansi) {
    let items = [];
    let inputs = [];
    let item = {};
    let element = tree;
    let arr = [];
    //Inputs
    if (ansi === 0) {
      arr = this.search_multiple_in_tree(element, 'parameter_declaration');
    } else {
      arr = this.search_multiple_in_tree(element, 'parameter_declaration');
    }

    if (arr.length === 0) {
      arr = this.search_multiple_in_tree(element, 'parameter_port_declaration');
    }

    inputs = arr;
    for (let x = 0; x < inputs.length; ++x) {
      let comment = "";
      let pre_comment = comments[inputs[x].startPosition.row];
      if (pre_comment !== undefined) {
        if (this.comment_symbol === "" || pre_comment[0] === this.comment_symbol) {
          comment = pre_comment.substring(1);
        } else {
          comment = "";
        }
      }
      item = {
        "name": this.get_generic_name(inputs[x], lines),
        "type": this.get_generic_kind(inputs[x], lines),
        "default_value": this.get_generic_default(inputs[x], lines),
        "description": comment
      };
      items.push(item);
    }
    return items;
  }



  get_library_name(port, lines) {
    let arr = this.search_multiple_in_tree(port, 'double_quoted_string');
    if (arr.length === 0) {
      let lib = this.extract_data(arr[0], lines);
      return lib;
    } else {
      let lib = this.extract_data(arr[0], lines).substr(1, this.extract_data(arr[0], lines).length - 2);
      let split_lib = lib.split(',');
      for (let x = 0; x < split_lib.length; ++x) {
        return lib;
      }
    }
  }

  get_generic_name(port, lines) {
    let arr = this.search_multiple_in_tree(port, 'parameter_identifier');
    if (arr.length === 1) {
      arr = this.search_multiple_in_tree(port, 'simple_identifier');
      let port_name = this.extract_data(arr[0], lines);
      return port_name;
    } else {
      let port_name = this.extract_data(arr[0], lines);
      let split_port_name = port_name.split(',');
      for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  get_generic_default(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'constant_param_expression');
    if (arr.length === 0) {
      var name = "undefined";
      return name;
    }
    var input_value = this.extract_data(arr[0], lines);
    return input_value;
  }

  get_always_name(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'block_identifier');
    if (arr.length === 0) {
      var name = "unnamed";
      return name;
    }
    var always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_always_sens_list(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'event_control');
    if (arr.length === 0) {
      var name = '';
      return name;
    }
    var always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_instantiation_name(always, lines) {
    var arr = this.search_multiple_in_tree(always, 'name_of_instance');
    if (arr.length === 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_type_type(input, lines) {
    var arr = this.search_multiple_in_tree(input, 'interface_identifier');
    if (arr.length === 0) {
      var name = "undefined";
      return name;
    }
    var always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_type_type_pkg(input) {
    let arr = this.search_multiple_in_tree(input, 'data_type');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let name = arr[0].text.replace(/\/\/(.+)/gi, '');
    return name;
  }
  get_signal_type(input, lines, command) {
    let arr = this.search_multiple_in_tree(input, command);
    if (arr.length === 0) {
      arr = this.search_multiple_in_tree(input, 'net_type_identifier');
    }
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_type_name(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'list_of_interface_identifiers');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_type_name_pkg(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'type_identifier');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_port_default(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'list_of_interface_identifiers');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_signal_name(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'net_identifier');
    let names = [];
    let name;
    if (arr.length === 0) {
      name = "undefined";
    } else {
      for (let i = 0; i < arr.length; ++i) {
        let input_name = this.extract_data(arr[i], lines);
        names.push(input_name);
      }
    }
    let arr2 = this.search_multiple_in_tree(input, 'variable_identifier');
    if (arr2.length === 0 && name === "undefined") {
      name = "undefined";
      return name;
    }
    for (let i = 0; i < arr2.length; ++i) {
      let input_name = this.extract_data(arr2[i], lines);
      names.push(input_name);
    }
    return names;
  }

  get_constant_name(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'parameter_identifier');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_constant_type(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'data_type_or_implicit1');
    if (arr.length === 0) {
      let name = '';
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_constant_default(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'constant_param_expression');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_function_name(input, lines) {
    let arr = this.search_multiple_in_tree(input, 'simple_identifier');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let input_name = this.extract_data(arr[0], lines);
    return input_name;
  }

  get_instantiation_type(always, lines) {
    let arr = this.search_multiple_in_tree(always, 'simple_identifier');
    if (arr.length === 0) {
      let name = "undefined";
      return name;
    }
    let always_name = this.extract_data(arr[0], lines);
    return always_name;
  }

  get_generic_kind(port, lines) {
    let arr = this.search_multiple_in_tree(port, 'data_type_or_implicit1');
    if (arr.length === 0) {
      return "";
    } else {
      let port_name = this.extract_data(arr[0], lines);
      let split_port_name = port_name.split(',');
      for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
  }

  get_entityName(tree, lines) {
    let element = tree;
    let arr = this.search_multiple_in_tree(element, 'module_header');
    element = arr;
    arr = this.search_multiple_in_tree(element[0], 'simple_identifier');
    let module_index = this.index(arr[0]);
    let item = {
      "name": this.extract_data(arr[0], lines),
      "description": ""
    };

    let description = "";
    let comments = this.search_multiple_in_tree(tree, 'comment');
    for (let x = 0; x < comments.length; ++x) {
      if (comments[x].startPosition.row >= module_index[0]) {
        break;
      }
      let comment_str = this.extract_data(comments[x], lines).substr(2) + '\n ';
      if (this.comment_symbol === "" || comment_str[0] === this.comment_symbol) {
        description += comment_str.substring(1);
      }
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
      "name": this.extract_data(arr[0], lines),
      "description": ""
    };

    var description = "";
    var comments = this.search_multiple_in_tree(tree, 'comment');
    for (var x = 0; x < comments.length; ++x) {
      if (comments[x].startPosition.row >= module_index[0]) { break; }
      var comment_str = this.extract_data(comments[x], lines).substr(2) + '\n ';
      if (this.comment_symbol === "" || comment_str[0] === this.comment_symbol) {
        description += comment_str.substring(1);
      }
    }
    description += '\n';
    item["description"] = description;

    return item;
  }

  get_processes(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'always_construct');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      var arr1 = this.get_deep_process(inputs[x]);
      item = {
        "name": this.get_process_label(arr1),
        "sens_list": this.get_always_sens_list(inputs[x], lines),
        "description": comment,
        'start_line': start_line
      };
      items.push(item);
    }
    return items;
  }

  get_instantiations(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'module_instantiation');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      item = {
        "name": this.get_instantiation_name(inputs[x], lines),
        "type": this.get_instantiation_type(inputs[x], lines),
        "description": comment,
        'start_line': start_line
      };
      items.push(item);
    }
    return items;
  }

  get_types(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'interface_port_declaration'); //port_declaration
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      var arr_types = this.get_type_name(inputs[x], lines);
      var split_arr_types = arr_types.split(',');
      for (var s = 0; s < split_arr_types.length; ++s) {
        var name_type = split_arr_types[s];
        item = {
          "name": name_type.trim(),
          "type": this.get_type_type(inputs[x], lines),
          "description": comment,
          'start_line': start_line
        };
        items.push(item);
      }
    }
    return items;
  }

  get_types_pkg(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'type_declaration'); //port_declaration
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      let type = this.get_type_type_pkg(inputs[x], lines);
      var arr_types = this.get_type_name_pkg(inputs[x], lines);
      var split_arr_types = arr_types.split(',');
      for (var s = 0; s < split_arr_types.length; ++s) {
        var name_type = split_arr_types[s];
        item = {
          "name": name_type.trim(),
          "type": type,
          "description": comment,
          'start_line': start_line
        };
        if (type !== '') {
          items.push(item);
        }
      }
    }
    return items;
  }

  get_signals(tree, lines, comments) {
    let items = [];
    let inputs = [];
    let inputs2 = [];
    let element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    let arr = this.search_multiple_in_tree(element, 'net_declaration');
    let arr2 = this.search_multiple_in_tree(element, 'data_declaration');
    inputs = arr;
    inputs2 = arr2;

    this.get_signal_array(inputs, comments, items, lines, 'list_of_net_decl_assignments',
      'net_type', 'packed_dimension', start_line);

    this.get_signal_array(inputs2, comments, items, lines, 'list_of_variable_decl_assignments',
      'data_type_or_implicit1', 0, start_line);
    return items;
  }

  get_signal_array(inputs, comments, items, lines, name_command, type_command, type_dim, start_line) {
    var item = {};
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      var arr_signals = this.get_signal_name(inputs[x], lines, name_command);
      if (arr_signals !== 'undefined') {
        let signal_type = this.get_signal_type(inputs[x], lines, type_command);
        let signal_type_dim = this.get_signal_type(inputs[x], lines, type_dim);
        if (signal_type_dim !== 'undefined') {
          if (signal_type !== signal_type_dim) {
            signal_type = signal_type + ' ' + signal_type_dim;
          }
        }
        for (var s = 0; s < arr_signals.length; ++s) {
          var name_signal = arr_signals[s];
          item = {
            "name": name_signal.trim(),
            "type": signal_type,
            "description": comment,
            "start_line": start_line
          };
          if (signal_type !== 'undefined') {
            items.push(item);
          }
        }
      }
    }
    return items;
  }

  get_constants(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'local_parameter_declaration');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      var arr2 = this.search_multiple_in_tree(inputs[x], 'param_assignment');
      for (var x2 = 0; x2 < arr2.length; ++x2) {
        item = {
          "name": this.get_constant_name(arr2[x2], lines),
          "type": this.get_constant_type(inputs[x], lines),
          "default_value": this.get_constant_default(arr2[x2], lines),  // constant_param_expression
          "description": comment,
          "start_line": start_line
        };
        items.push(item);
      }
    }
    return items;
  }

  get_functions(tree, lines) {
    var items = [];
    var inputs = [];
    var item = {};
    var element = tree;
    let start_line = element.startPosition.row;
    //Inputs
    var arr = this.search_multiple_in_tree(element, 'function_identifier');
    inputs = arr;
    for (var x = 0; x < inputs.length; ++x) {
      let comment = "";
      item = {
        "name": this.get_function_name(inputs[x], lines),
        "description": comment,
        "start_line": start_line
      };
      items.push(item);
    }
    return items;
  }

  extract_data(node, lines) {
    return lines[node.startPosition.row].substr(node.startPosition.column,
      node.endPosition.column - node.startPosition.column);
  }

  index(node) {
    return [node.startPosition.row, node.startPosition.column];
  }

  fileLines(source) {
    var array = source.toString().split("\n");
    return array;
  }
}
module.exports = Parser;