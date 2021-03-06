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

const stm_base = require('./stm_base_parser');
const Path = require('path');
const { lab } = require('d3');

class Paser_stm_verilog extends stm_base.Parser_stm_base {
  constructor(comment_symbol) {
    super();
    this.comment_symbol = comment_symbol;
  }
  
  set_comment_symbol(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }
  
  async init() {
    try{
      const Parser = require('web-tree-sitter');
      await Parser.init();
      this.parser = new Parser();
      let Lang = await Parser.Language.load(Path.join(__dirname, Path.sep + "parsers" + Path.sep + "tree-sitter-verilog.wasm"));
      this.parser.setLanguage(Lang);
      this.loaded_wasm = true;
    }
    catch(e){console.log(e);}
  }

  async get_svg_sm(code) {
    let process;
    try {
      const tree = this.parser.parse(code);
      process = this.get_process(tree);
    }
    catch (e) {
      // eslint-disable-next-line no-console
      // console.log(e);
      return { 'svg': [], 'stm': [] };
    }
    let stm = [];
    let svg = [];
    for (let i = 0; i < process.length; ++i) {
      let states;
      try {
        states = this.get_process_info(process[i]);
      }
      catch (e) {
        // eslint-disable-next-line no-console
        // console.log(e);
        states = undefined;
      }
      if (states !== undefined) {
        for (let j = 0; j < states.length; ++j) {
          if (this.check_stm(states[j]) === true) {
            stm.push(states[j]);
            let svg_tmp = this.json_to_svg(states[j]);
            let stm_tmp = {
              'svg': svg_tmp,
              'description': states[j].description
            };
            svg.push(stm_tmp);
          }
        }
      }
    }
    return { 'svg': svg, 'stm': stm };
  }

  get_process(tree) {
    if (this.comment_symbol === '') {
      this.comment_symbol = ' ';
    }
    let process_array = [];
    let arch_body = this.get_architecture_body(tree);
    let cursor = arch_body.walk();
    let comments = '';
    // Process
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'module_or_generate_item') {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'always_construct') {
            let process = {
              'code': this.get_deep_process(cursor.currentNode()),
              'comments': comments
            };
            process_array.push(process);
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
      }
      else {
        comments = '';
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return process_array;
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

  get_process_info(proc) {
    let stms = [];

    let p = proc.code;
    let name = this.get_process_label(p);
    let case_statements = this.get_case_process(p);
    for (let i = 0; i < case_statements.length; ++i) {
      let description = proc.comments;
      let p_info = {
        'description': description.replace('fsm_extract', ''),
        'name': '',
        'state_variable_name': '',
        'states': []
      };
      p_info.name = name;
      if (case_statements !== undefined && case_statements.length !== 0) {
        p_info.state_variable_name = this.get_state_variable_name(case_statements[i]);
        p_info.states = this.get_states(case_statements[i], p_info.state_variable_name);
        let check = this.check_empty_states_transitions(p_info.states);
        if (check === true && description.includes('fsm_extract') === true) {
          let result = this.force_case_stm(case_statements[i]);
          p_info.state_variable_name = result.variable_name;
          p_info.states = result.states;
        }
        stms.push(p_info);
      }
    }
    return stms;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Force
  //////////////////////////////////////////////////////////////////////////////
  force_case_stm(p) {
    let state_names = this.get_state_names_from_case(p);
    let state_name_candidate = this.search_state_variable_candidates(p, state_names);
    let states = this.get_states(p, state_name_candidate);
    return { 'variable_name': state_name_candidate, 'states': states };
  }

  get_state_names_from_case(p) {
    let state_names = [];
    let state_names_case = this.search_multiple_in_tree(p, 'case_item_expression');
    for (let i = 0; i < state_names_case.length; ++i) {
      state_names.push(state_names_case[i].text);
    }
    return state_names;
  }

  search_state_variable_candidates(p, state_names) {
    let candidates = [];
    let signals = this.search_multiple_in_tree(p, 'blocking_assignment');
    for (let i = 0; i < signals.length; ++i) {
      let rigth = this.get_rigth_simple_waveform_assignment(signals[i]);
      if (rigth !== undefined) {
        let left = this.get_left_simple_waveform_assignment(signals[i]);
        if (state_names.includes(rigth) === true) {
          candidates.push(left);
        }
      }
    }

    let variables = this.search_multiple_in_tree(p, 'nonblocking_assignment');
    for (let i = 0; i < variables.length; ++i) {
      let rigth = this.get_rigth_simple_variable_assignment(variables[i]);
      if (rigth !== undefined) {
        let left = this.get_rigth_simple_variable_assignment(variables[i]);
        if (state_names.includes(rigth) === true) {
          candidates.push(left);
        }
      }
    }
    let unique = this.mode(candidates);
    return unique;
  }

  mode(array) {
    if (array.length == 0)
      return null;
    var mode_map = {};
    var max_el = array[0], max_count = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (mode_map[el] == null)
        mode_map[el] = 1;
      else
        mode_map[el]++;
      if (mode_map[el] > max_count) {
        max_el = el;
        max_count = mode_map[el];
      }
    }
    return max_el;
  }
  //////////////////////////////////////////////////////////////////////////////

  get_states(p, state_variable_name) {
    let case_items = this.get_item_multiple_from_childs(p, 'case_item');
    let case_state = [];
    for (let i = 0; i < case_items.length; ++i) {
      let state = {
        'name': '',
        'transitions': [],
        'start_position': [],
        'end_position': []
      };
      let result = this.get_item_from_childs(case_items[i], 'case_item_expression');
      if (result !== undefined && result.text !== 'default') {
        state.name = result.text;
        state.start_position = [result.startPosition.row, result.startPosition.column];
        state.end_position = [result.endPosition.row, result.endPosition.column];
        state.transitions = this.get_transitions(case_items[i], state_variable_name);

        case_state.push(state);
      }
    }
    return case_state;
  }

  get_transitions(p, state_variable_name, metacondition) {
    let assign_transitions = [];
    let if_transitions = [];
    let last_transitions = [];
    let transitions = [];
    let skip = false;
    let last = 0;

    let statement_or_null;
    if (p.type !== 'statement_or_null') {
      statement_or_null = this.get_item_from_childs(p, 'statement_or_null');
    }
    else {
      statement_or_null = p.walk().currentNode();
    }
    let statement = this.get_item_from_childs(statement_or_null, 'statement');
    let statement_item = this.get_item_from_childs(statement, 'statement_item');
    let seq_block = this.get_item_from_childs(statement_item, 'seq_block');
    let itera_item = [];
    if (seq_block === undefined) {
      itera_item = [statement_item];
      skip = true;
    }
    else {
      itera_item = this.get_item_multiple_from_childs(seq_block, 'statement_or_null');
    }
    for (let i = 0; i < itera_item.length; ++i) {
      let statement_item_2 = itera_item[i];
      if (skip === false) {
        let statement_2 = this.get_item_from_childs(itera_item[i], 'statement');
        statement_item_2 = this.get_item_from_childs(statement_2, 'statement_item');
      }
      //Search if
      let type;
      let block;
      let if_statement = this.get_item_from_childs(statement_item_2, 'conditional_statement');
      if (if_statement === undefined) {
        //Search assignment
        let assign_statement = this.get_item_from_childs(statement_item_2, 'blocking_assignment');
        if (assign_statement !== undefined) {
          type = 'simple_waveform_assignment';
          block = assign_statement;
        }
        else {
          let nonassign_statement = this.get_item_from_childs(statement_item_2, 'nonblocking_assignment');
          if (nonassign_statement !== undefined) {
            type = 'simple_waveform_assignment';
            block = nonassign_statement;
          }
        }
      }
      else {
        type = 'if_statement';
        block = if_statement;
      }

      if (type === 'if_statement') {
        let tmp_transitions = this.get_if_transitions(block, state_variable_name, metacondition);
        if_transitions = if_transitions.concat(tmp_transitions);
        last = 0;
      }
      else if (type === 'simple_waveform_assignment') {
        let tmp_transitions = this.get_assignament_transitions(block, state_variable_name, metacondition);
        if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
          assign_transitions = tmp_transitions;
          last_transitions = tmp_transitions;
          last = 1;
        }
      }
    }

    if (last === 1) {
      transitions = last_transitions;
    }
    else {
      transitions = if_transitions.concat(assign_transitions);
    }
    return transitions;
  }

  get_if_transitions(p, state_variable_name, metacondition) {
    let transitions = [];
    let ifs = this.get_if_elsif_else(p);
    //Set else condition
    let conditions = [];
    let else_condition = '';
    for (let i = 0; i < ifs.length; ++i) {
      let condition = ifs[i].condition;
      if (condition !== '' && conditions.includes(condition) === false) {
        else_condition += `not (${condition})\n`;
      }
      else {
        let tmp_condition = else_condition.slice(0, -1);
        //Remove duplicate conditions
        let current_conditions = tmp_condition.split('\n');
        let unique = current_conditions.filter(this.only_unique);
        let condition_tmp = '';
        for (let i = 0; i < unique.length - 1; ++i) {
          condition_tmp += unique[i] + '\n';
        }
        condition_tmp += unique[unique.length - 1] + '\n';
        condition = condition_tmp;
        ifs[i].condition = condition;
      }
      conditions.push(condition);
    }

    for (let i = 0; i < ifs.length; ++i) {
      let transition = this.get_transition(ifs[i], state_variable_name, metacondition);
      if (transition !== undefined) {
        transitions = transitions.concat(transition);
      }
    }
    return transitions;
  }

  get_if_elsif_else(p) {
    let ifs = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      let start_position = cursor.startPosition;
      let end_position = cursor.endPosition;
      if (cursor.nodeType === 'else') {
        let break_p = false;
        while (break_p === false && cursor.gotoNextSibling() !== false) {
          if (cursor.nodeType === 'statement_or_null') {
            let item = this.get_item_from_childs(cursor.currentNode(), 'statement');
            let statement_item = this.get_item_from_childs(item, 'statement_item');

            let block_item = this.get_item_from_childs(statement_item, 'seq_block');
            if (block_item !== undefined) {
              item = this.get_item_from_childs(block_item, 'statement_or_null');
              item = this.get_item_from_childs(item, 'statement');
              statement_item = this.get_item_from_childs(item, 'statement_item');
            }
            item = this.get_item_from_childs(statement_item, 'conditional_statement');
            if (item !== undefined) {
              let tmp_ifs = this.get_if_elsif_else(item);
              ifs = ifs.concat(tmp_ifs);
            }
            else {
              let if_item_else = {
                'condition': '',
                'code': '',
                'start_position': '',
                'end_position': ''
              };

              let blocking_assignment = this.get_item_from_childs(statement_item, 'blocking_assignment');
              if (blocking_assignment !== undefined) {
                if (block_item !== undefined) {
                  if_item_else.code = block_item;
                  // if_item_else.start_position = start_position;
                  // if_item_else.end_position = end_position;
                }
                else {
                  if_item_else.code = statement_item;
                  // if_item_else.start_position = start_position;
                  // if_item_else.end_position = end_position;
                }
                ifs.push(if_item_else);
              }
              else {
                let nonblocking_assignment = this.get_item_from_childs(statement_item, 'nonblocking_assignment');
                if (nonblocking_assignment !== undefined) {
                  if (block_item !== undefined) {
                    if_item_else.code = block_item;
                    // if_item_else.start_position = start_position;
                    // if_item_else.end_position = end_position;
                  }
                  else {
                    if_item_else.code = statement_item;
                    // if_item_else.start_position = start_position;
                    // if_item_else.end_position = end_position;
                  }
                  ifs.push(if_item_else);
                }
              }
            }
          }
        }
      }
      else if (cursor.nodeType === 'if') {
        let break_p = false;
        let if_item = {
          'condition': '',
          'code': ''
        };
        while (break_p === false && cursor.gotoNextSibling() !== false) {
          if (cursor.nodeType === 'cond_predicate') {
            let item = this.get_item_from_childs(cursor.currentNode(), 'expression_or_cond_pattern');
            if (item !== undefined) {
              if_item.condition = item.text;
              if_item.start_position = item.startPosition;
              if_item.end_position = item.endPosition;
            }
          }
          else if (cursor.nodeType === 'statement_or_null') {
            let item = this.get_item_from_childs(cursor.currentNode(), 'statement');
            item = this.get_item_from_childs(item, 'statement_item');
            if (this.get_item_from_childs(item, 'seq_block') !== undefined) {
              item = this.get_item_from_childs(item, 'seq_block');
              if_item.start_position = item.startPosition;
              if_item.end_position = item.endPosition;
              // item = this.get_item_from_childs(item, 'statement_or_null');
              // item = this.get_item_from_childs(item, 'statement');
              // item = this.get_item_from_childs(item, 'statement_item');
            }
            if_item.code = item;
            break_p = true;
            ifs.push(if_item);
          }
        }
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return ifs;
  }

  get_assignament_transitions(p, state_variable_name, metacondition) {
    let transitions = [];

    let tmp_destination = this.check_get_simple_waveform_assignment(p, state_variable_name);
    if (tmp_destination !== undefined) {
      let s_position = p.startPosition;
      let e_position = p.endPosition;
      let start_position = [s_position.row, e_position.column - 1];
      let end_position = [e_position.row, e_position.column];

      let condition = '';
      if (metacondition !== '' && metacondition !== undefined) {
        condition = metacondition;
      }

      let destination = tmp_destination;
      let transition = {
        'condition': condition,
        'destination': destination,
        'start_position': start_position,
        'end_position': end_position
      };
      transitions.push(transition);
    }
    return transitions;
  }

  get_transition(p, state_variable_name, metacondition) {
    let condition = p.condition;
    let tmp_start_position = p.start_position;
    let tmp_end_position = p.end_position;

    let start_position = [tmp_start_position.row, tmp_start_position.column];
    let end_position = [tmp_end_position.row, tmp_end_position.column];
    let transitions = this.get_transitions_in_if(p.code, state_variable_name,
      condition, start_position, end_position, metacondition);
    return transitions;
  }

  get_start_position_array(p) {
    let tmp_position = p.code.startPosition;

    let position = [tmp_position.row, tmp_position.column];
    return tmp_position;
  }

  get_end_position_array(p) {
    let tmp_position = p.code.endPosition;

    let position = [tmp_position.row, tmp_position.column];
    return tmp_position;
  }

  get_transitions_in_if(p, state_variable_name, condition, start_position, end_position, metacondition) {
    let last = 0;
    let last_transitions = [];
    //if transitions
    let if_transitions = [];
    //assign transitions
    let assign_transitions = [];
    let transitions = [];
    let destination = undefined;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'blocking_assignment' || cursor.nodeType === 'nonblocking_assignment') {
        let tmp_destination = this.check_get_simple_waveform_assignment(cursor.currentNode(), state_variable_name);
        if (tmp_destination !== undefined) {
          destination = tmp_destination;
          if (condition !== undefined && destination !== undefined) {
            let transition = {
              'condition': '',
              'destination': '',
              'start_position': start_position,
              'end_position': end_position
            };
            if (metacondition !== undefined && metacondition !== '') {
              condition += `\n${metacondition}`;
              let current_conditions = condition.split('\n');
              let unique = current_conditions.filter(this.only_unique);
              let condition_tmp = '';
              for (let i = 0; i < unique.length - 1; ++i) {
                condition_tmp += unique[i] + '\n';
              }
              condition_tmp += unique[unique.length - 1] + '\n';
              condition = condition_tmp;
            }

            transition.condition = condition;
            transition.destination = destination;
            last = 1;
            assign_transitions = [transition];
            last_transitions = [transition];
          }
        }
      }
      else if (cursor.nodeType === 'simple_variable_assignment') {
        let tmp_destination = this.check_get_simple_variable_assignment(cursor.currentNode(), state_variable_name);
        if (tmp_destination !== undefined) {
          destination = tmp_destination;
          if (condition !== undefined && destination !== undefined) {
            let transition = {
              'condition': '',
              'destination': '',
              'start_position': start_position,
              'end_position': end_position
            };
            if (metacondition !== undefined && metacondition !== '') {
              condition += `\n${metacondition}`;
              let current_conditions = condition.split('\n');
              let unique = current_conditions.filter(this.only_unique);
              let condition_tmp = '';
              for (let i = 0; i < unique.length - 1; ++i) {
                condition_tmp += unique[i] + '\n';
              }
              condition_tmp += unique[unique.length - 1] + '\n';
              condition = condition_tmp;
            }

            transition.condition = condition;
            transition.destination = destination;
            last = 1;
            assign_transitions = [transition];
            last_transitions = [transition];
          }
        }
      }
      else if (cursor.nodeType === 'conditional_statement') {
        last = 0;
        let if_transitions_tmp = this.get_if_transitions(cursor.currentNode(), state_variable_name, condition);
        if_transitions = if_transitions.concat(if_transitions_tmp);
      }
      else if (cursor.nodeType === 'statement_or_null') {
        last = 0;

        //check assignement
        let item = this.get_item_from_childs(cursor.currentNode(), 'statement');
        item = this.get_item_from_childs(item, 'statement_item');
        let item_0 = this.get_item_from_childs(item, 'blocking_assignment');
        let item_1 = this.get_item_from_childs(item, 'nonblocking_assignment');
        let if_item = true;
        if (item_0 !== undefined || item_1 !== undefined) {
          if_item = false;
        }
        if (metacondition !== undefined && metacondition !== '') {
          condition += `\n${metacondition}`;
          let current_conditions = condition.split('\n');
          let unique = current_conditions.filter(this.only_unique);
          let condition_tmp = '';
          for (let i = 0; i < unique.length - 1; ++i) {
            condition_tmp += unique[i] + '\n';
          }
          condition_tmp += unique[unique.length - 1] + '\n';
          condition = condition_tmp;
        }

        let if_transitions_tmp = [];
        //check block if
        let item_block_if = this.get_item_from_childs(item, 'conditional_statement');
        if (item_block_if === undefined) {
          if_transitions_tmp = this.get_transitions(cursor.currentNode(), state_variable_name, condition);
        }
        else {
          if_transitions_tmp = this.get_if_transitions(item_block_if, state_variable_name, condition);
        }

        if (if_item === false) {
          if (if_transitions_tmp.length !== 0) {
            assign_transitions = if_transitions_tmp;
            last_transitions = if_transitions_tmp;
          }
        }
        else {
          if_transitions = if_transitions.concat(if_transitions_tmp);
        }

      }
    }
    while (cursor.gotoNextSibling() !== false);


    if (last !== 0) {
      transitions = last_transitions;
    }
    else {
      transitions = if_transitions.concat(assign_transitions);
    }
    return transitions;
  }

  check_get_simple_waveform_assignment(p, state_variable_name) {
    let destination = undefined;
    let left = this.get_left_simple_waveform_assignment(p);
    if (left === state_variable_name) {
      destination = this.get_rigth_simple_waveform_assignment(p);
    }
    return destination;
  }

  check_get_simple_variable_assignment(p, state_variable_name) {
    let destination = undefined;
    let left = this.get_left_simple_waveform_assignment(p);
    if (left === state_variable_name) {
      destination = this.get_rigth_simple_variable_assignment(p);
    }
    return destination;
  }

  get_left_simple_waveform_assignment(p) {
    let left = '';
    let item = this.get_item_from_childs(p, 'operator_assignment');
    item = this.get_item_from_childs(item, 'variable_lvalue');
    if (item !== undefined) {
      left = item.text;
    }
    if (left === '') {
      item = this.get_item_from_childs(p, 'variable_lvalue');
      if (item !== undefined) {
        left = item.text;
      }
    }
    return left;
  }

  get_rigth_simple_waveform_assignment(p) {
    let rigth = undefined;
    let item = this.get_item_from_childs(p, 'operator_assignment');
    item = this.get_item_from_childs(item, 'expression');
    if (item !== undefined) {
      rigth = item.text;
    }
    if (rigth === undefined) {
      item = this.get_item_from_childs(p, 'expression');
      if (item !== undefined) {
        rigth = item.text;
      }
    }
    return rigth;
  }

  get_rigth_simple_variable_assignment(p) {
    let rigth = undefined;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'simple_name') {
        rigth = cursor.nodeText;
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return rigth;
  }

  get_state_variable_name(p) {
    let state_variable_name = undefined;
    let case_expression = this.get_item_from_childs(p, 'case_expression');
    if (case_expression !== undefined) {
      state_variable_name = case_expression.text;
    }
    return state_variable_name;
  }

  get_case_process(p) {
    let case_statement = this.search_multiple_in_tree(p, 'case_statement');
    return case_statement;
  }

  get_process_label(p) {
    let label_txt = '';
    let label = this.get_item_from_childs(p, "block_identifier");
    if (label === undefined) {
      label_txt = ''
    }
    else {
      label_txt = label.text;
    }
    return label_txt;
  }
}

module.exports = {
  Paser_stm_verilog: Paser_stm_verilog
};
