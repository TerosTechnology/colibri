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

const Path = require('path');
const stm_base = require('./stm_base_parser');

class Paser_stm_vhdl extends stm_base.Parser_stm_base {
  constructor(comment_symbol) {
    super();
    this.comment_symbol = comment_symbol;
  }
  
  set_comment_symbol(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }
  
  async get_svg_sm(code) {
    try {
      const Parser = await require('web-tree-sitter');
      await Parser.init();
      this.parser = new Parser();
      let Lang = await
        Parser.Language.load(Path.join(__dirname, Path.sep + "parsers" + Path.sep + "tree-sitter-vhdl.wasm"));
      this.parser.setLanguage(Lang);
    }
    catch(e){console.log(e);}

    let process;
    let tree;
    try {
      tree = this.parser.parse(code);
      process = this.get_process(tree);
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
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
        console.log(e);
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
      if (cursor.nodeType === 'process_statement') {
        let process = {
          'code': cursor.currentNode(),
          'comments': comments
        };
        process_array.push(process);
        comments = '';
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

  get_architecture_body(p) {
    let cursor = p.walk();
    let item = this.get_item_multiple_from_childs(cursor.currentNode(), 'design_unit');
    if (item.length === 2) {
      item = this.get_item_from_childs(item[1], 'architecture_body');
      item = this.get_item_from_childs(item, 'concurrent_statement_part');
      return item;
    }
    else {
      return undefined;
    }
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

  force_case_stm(p) {
    let state_names = this.get_state_names_from_case(p).map(v => v.toLowerCase());
    let state_name_candidate = this.search_state_variable_candidates(p, state_names);
    let states = this.get_states(p, state_name_candidate);
    return { 'variable_name': state_name_candidate, 'states': states };
  }

  search_state_variable_candidates(p, state_names) {
    let candidates = [];
    let signals = this.search_multiple_in_tree(p, 'simple_waveform_assignment');
    for (let i = 0; i < signals.length; ++i) {
      let rigth = this.get_item_from_childs(signals[i], 'waveforms');
      if (rigth !== undefined) {
        let rigth_text = rigth.text.toLowerCase();
        let left = this.get_left_simple_waveform_assignment(signals[i]);
        if (state_names.includes(rigth_text) === true) {
          candidates.push(left);
        }
      }
    }

    let variables = this.search_multiple_in_tree(p, 'simple_variable_assignment');
    for (let i = 0; i < variables.length; ++i) {
      let rigth = this.get_item_from_childs(variables[i], 'waveforms');
      if (rigth !== undefined) {
        let rigth_text = rigth.text.toLowerCase();
        let left = this.get_left_simple_waveform_assignment(signals[i]);
        if (state_names.includes(rigth_text) === true) {
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

  get_state_names_from_case(p) {
    let state_names = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'case_statement_alternative') {
        let result = this.get_state_name(cursor.currentNode());
        let name = result.state_name;
        state_names.push(name);
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return state_names;
  }



  get_states(p, state_variable_name) {
    let case_state = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'case_statement_alternative') {
        let state = {
          'name': '', 'transitions': [],
          'start_position': [],
          'end_position': []
        };
        let result = this.get_state_name(cursor.currentNode());
        let name = result.state_name;
        if (name !== undefined && name.toLocaleLowerCase() !== 'others') {
          state.name = result.state_name;
          state.start_position = result.start_position;
          state.end_position = result.end_position;
          state.transitions = this.get_transitions(cursor.currentNode(), state_variable_name);

          case_state.push(state);
        }
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return case_state;
  }

  get_transitions(p, state_variable_name) {
    let transitions = [];
    let cursor = p.walk();
    let last = 0;
    let last_transitions = [];
    //if transitions
    let if_transitions = [];
    //assign transitions
    let assign_transitions = [];

    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'sequence_of_statements') {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'if_statement') {
            let tmp_transitions = this.get_if_transitions(cursor.currentNode(), state_variable_name);
            if_transitions = if_transitions.concat(tmp_transitions);
            last = 0;
          }
          else if (cursor.nodeType === 'simple_waveform_assignment') {
            let tmp_transitions = this.get_assignament_transitions(cursor.currentNode(), state_variable_name);
            if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
              assign_transitions = tmp_transitions;
              last_transitions = tmp_transitions;
              last = 1;
            }
          }
          else if (cursor.nodeType === 'simple_variable_assignment') {
            let tmp_transitions = this.get_assignament_variable_transitions(cursor.currentNode(), state_variable_name);
            if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
              assign_transitions = tmp_transitions;
              last_transitions = tmp_transitions;
              last = 1;
            }
          }
          else if (cursor.nodeType === 'case_statement') {
            let tmp_transitions = this.get_case_transitions(cursor.currentNode(), state_variable_name);
            if_transitions = if_transitions.concat(tmp_transitions);
            last = 0;
          }
        }
        while (cursor.gotoNextSibling() !== false);
      }
    }
    while (cursor.gotoNextSibling() !== false);
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
    let cursor = p.walk();
    let else_conditions = '';
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'elsif' || cursor.nodeType === 'if') {
        let if_condition = this.get_condition(cursor.currentNode());
        if (if_condition !== undefined) {
          else_conditions += `not (${if_condition.condition})\n`;
        }
        let transition = this.get_transition(cursor.currentNode(), state_variable_name, metacondition);
        if (transition !== undefined) {
          transitions = transitions.concat(transition);
        }
      }
      else if (cursor.nodeType === 'else') {
        if (metacondition !== undefined) {
          else_conditions = metacondition + '\n' + else_conditions;
        }
        let transition = this.get_transition(cursor.currentNode(), state_variable_name, else_conditions);
        if (transition !== undefined) {
          transitions = transitions.concat(transition);
        }
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return transitions;
  }

  get_case_transitions(p, state_variable_name, metacondition) {
    let transitions = [];
    let cursor = p.walk();
    let else_conditions = '';
    let case_switch = this.get_item_from_childs(cursor.currentNode(), 'simple_name').text;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'case_statement_alternative') {
        let choice = this.get_item_from_childs(cursor.currentNode(), 'choices');
        let choice_txt = choice.text;
        let if_condition = `${case_switch} = ${choice_txt}`;
        if (choice_txt.toLocaleLowerCase() === 'others') {
          if_condition = else_conditions;
        }
        else if (if_condition !== undefined) {
          else_conditions += `not (${if_condition})\n`;
        }
        let transition = this.get_transition(cursor.currentNode(), state_variable_name, metacondition, if_condition);
        if (transition !== undefined) {
          transitions = transitions.concat(transition);
        }
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return transitions;
  }

  get_assignament_transitions(p, state_variable_name) {
    let transitions = [];

    let tmp_destination = this.check_get_simple_waveform_assignment(p, state_variable_name);
    if (tmp_destination !== undefined) {
      let s_position = p.startPosition;
      let e_position = p.endPosition;
      let start_position = [s_position.row, e_position.column - 1];
      let end_position = [e_position.row, e_position.column];

      let destination = tmp_destination;
      let transition = {
        'condition': '', 'destination': destination,
        'start_position': start_position,
        'end_position': end_position
      };
      transitions.push(transition);
    }
    return transitions;
  }

  get_assignament_variable_transitions(p, state_variable_name) {
    let transitions = [];

    let tmp_destination = this.check_get_simple_variable_assignment(p, state_variable_name);
    if (tmp_destination !== undefined) {
      let s_position = p.startPosition;
      let e_position = p.endPosition;
      let start_position = [s_position.row, e_position.column - 1];
      let end_position = [e_position.row, e_position.column];

      let destination = tmp_destination;
      let transition = {
        'condition': '', 'destination': destination,
        'start_position': start_position,
        'end_position': end_position
      };
      transitions.push(transition);
    }
    return transitions;
  }

  get_transition(p, state_variable_name, metacondition, choice) {
    let result = this.get_condition(p, choice);
    let condition = result.condition;
    let start_position = result.start_position;
    let end_position = result.end_position;
    let transitions = this.get_transitions_in_if(p, state_variable_name,
      condition, start_position, end_position, metacondition);
    return transitions;
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
      if (cursor.nodeType === 'sequence_of_statements') {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'simple_waveform_assignment') {
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
          else if (cursor.nodeType === 'if_statement') {
            if (metacondition !== undefined && metacondition !== '') {
              condition += condition + '\n' + metacondition;
            }
            last = 0;
            if_transitions = this.get_if_transitions(cursor.currentNode(), state_variable_name, condition);
          }
          else if (cursor.nodeType === 'case_statement') {
            if (metacondition !== undefined && metacondition !== '') {
              condition += condition + '\n' + metacondition;
            }
            last = 0;
            if_transitions = this.get_case_transitions(cursor.currentNode(), state_variable_name, condition);
          }
        }
        while (cursor.gotoNextSibling() !== false);
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
    if (state_variable_name === undefined) {
      return destination;
    }
    if (this.get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
      destination = this.get_rigth_simple_waveform_assignment(p);
    }
    return destination;
  }

  check_get_simple_variable_assignment(p, state_variable_name) {
    let destination = undefined;
    if (state_variable_name === undefined) {
      return destination;
    }
    if (this.get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
      destination = this.get_rigth_simple_variable_assignment(p);
    }
    return destination;
  }

  get_left_simple_waveform_assignment(p) {
    let left = 'undefined';
    let cursor = p.walk();
    let break_p = false;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'simple_name') {
        left = cursor.nodeText;
        break_p = true;
      }
    }
    while (cursor.gotoNextSibling() !== false && break_p === false);
    return left;
  }

  get_rigth_simple_waveform_assignment(p) {
    let rigth = undefined;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'waveforms') {
        rigth = cursor.nodeText;
      }
    }
    while (cursor.gotoNextSibling() !== false);
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

  get_condition(p, choice) {
    let condition = '';
    let cursor = p.walk();
    let start_position = [];
    let end_position = [];
    let s_position = cursor.startPosition;
    let e_position = cursor.endPosition;
    start_position = [s_position.row, s_position.column];
    end_position = [e_position.row, e_position.column];

    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'relation' || cursor.nodeType === 'logical_expression'
        || cursor.nodeType === 'parenthesized_expression') {
        if (cursor.nodeType === 'parenthesized_expression') {
          condition = this.get_relation_of_parenthesized_expression(cursor.currentNode());
        }
        else {
          condition = cursor.nodeText;
        }
        s_position = cursor.startPosition;
        e_position = cursor.endPosition;
        start_position = [s_position.row, s_position.column];
        end_position = [e_position.row, e_position.column];
      }
      else if (cursor.nodeType === 'choices') {
        condition = choice;
        s_position = cursor.startPosition;
        e_position = cursor.endPosition;
        start_position = [s_position.row, s_position.column];
        end_position = [e_position.row, e_position.column];
      }
      if (cursor.nodeType === 'else') {
        s_position = cursor.startPosition;
        e_position = cursor.endPosition;
        start_position = [s_position.row, s_position.column];
        end_position = [e_position.row, e_position.column];
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return {
      'condition': condition, 'start_position': start_position, 'end_position': end_position
    };
  }

  get_relation_of_parenthesized_expression(p) {
    let relation = undefined;
    let cursor = p.walk();
    let break_p = false;
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'relation' || cursor.nodeType === 'logical_expression') {
        relation = cursor.nodeText;
        break_p = true;
      }
    }
    while (cursor.gotoNextSibling() !== false && break_p === false);
    return relation;
  }

  get_state_name(p) {
    let state_name = undefined;
    let start_position = [];
    let end_position = [];
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'choices') {
        let s_position = cursor.startPosition;
        let e_position = cursor.endPosition;
        start_position = [s_position.row, s_position.column];
        end_position = [e_position.row, e_position.column];
        state_name = cursor.nodeText;
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return { 'state_name': state_name, 'start_position': start_position, 'end_position': end_position };
  }


  get_state_variable_name(p) {
    let state_variable_name = undefined;
    let cursor = p.walk();
    cursor.gotoFirstChild();
    do {
      if (cursor.nodeType === 'simple_name') {
        state_variable_name = cursor.nodeText;
      }
      else if (cursor.nodeType === 'parenthesized_expression') {
        state_variable_name = cursor.nodeText.replace('(', '').replace(')', '');
      }
    }
    while (cursor.gotoNextSibling() !== false);
    return state_variable_name;
  }

  get_case_process(p) {
    let case_statement = this.search_multiple_in_tree(p, 'case_statement');
    return case_statement;
  }


  get_process_label(p) {
    let label = '';
    let cursor = p.walk();
    //Process label
    cursor.gotoFirstChild();
    if (cursor.nodeType === 'label') {
      cursor.gotoFirstChild();
      label = cursor.nodeText;
    }
    return label;
  }
}

module.exports = {
  Paser_stm_vhdl: Paser_stm_vhdl
};