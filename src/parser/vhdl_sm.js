
const Path = require('path');
const Parser = require('web-tree-sitter');
const stm_base = require('./stm_base_parser');

async function get_svg_sm(code, comment_symbol) {
  await Parser.init();
  const parser = new Parser();
  let Lang = await
    Parser.Language.load(Path.join(__dirname, Path.sep + "parsers" + Path.sep + "tree-sitter-vhdl.wasm"));
  parser.setLanguage(Lang);

  let process;
  try {
    const tree = parser.parse(code);
    process = get_process(tree, comment_symbol);
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return [];
  }
  let stm = [];
  let svg = [];
  for (let i = 0; i < process.length; ++i) {
    let states;
    try {
      states = get_process_info(process[i]);
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      states = undefined;
    }
    if (states !== undefined) {
      for (let j = 0; j < states.length; ++j) {
        if (check_stm(states[j]) === true) {
          stm.push(states[j]);
          let svg_tmp = json_to_svg(states[j]);
          let stm_tmp = {
            'svg': svg_tmp,
            'description': states[j].description
          };
          svg.push(stm_tmp);
        }
      }
    }
  }
  return svg;
}

function check_stm(stm) {
  let check = false;
  let states = stm.states;
  for (let i = 0; i < states.length; ++i) {
    let transitions = states[i].transitions;
    if (transitions.length > 0) {
      return true;
    }
  }
  return check;
}

function get_process(tree, comment_symbol) {
  if (comment_symbol === '') {
    comment_symbol = ' ';
  }
  let process_array = [];
  let arch_body = get_architecture_body(tree);
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
      if (txt_comment[0] === comment_symbol) {
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

function get_architecture_body(p) {
  let cursor = p.walk();
  let item = stm_base.get_item_multiple_from_childs(cursor.currentNode(), 'design_unit');
  if (item.length === 2) {
    item = stm_base.get_item_from_childs(item[1], 'architecture_body');
    item = stm_base.get_item_from_childs(item, 'concurrent_statement_part');
    return item;
  }
  else {
    return undefined;
  }
}

function get_process_info(proc) {
  let stms = [];

  let p = proc.code;
  let name = get_process_label(p);
  let case_statements = get_case_process(p);
  for (let i = 0; i < case_statements.length; ++i) {
    let p_info = {
      'description': proc.comments,
      'name': '',
      'state_variable_name': '',
      'states': []
    };
    p_info.name = name;
    if (case_statements !== undefined && case_statements.length !== 0) {
      p_info.state_variable_name = get_state_variable_name(case_statements[i]);
      p_info.states = get_states(case_statements[i], p_info.state_variable_name);
      stms.push(p_info);
    }
  }
  return stms;
}

function get_states(p, state_variable_name) {
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
      let result = get_state_name(cursor.currentNode());
      let name = result.state_name;
      if (name !== undefined && name.toLocaleLowerCase() !== 'others') {
        state.name = result.state_name;
        state.start_position = result.start_position;
        state.end_position = result.end_position;
        state.transitions = get_transitions(cursor.currentNode(), state_variable_name);

        case_state.push(state);
      }
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_state;
}

function get_transitions(p, state_variable_name) {
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
          let tmp_transitions = get_if_transitions(cursor.currentNode(), state_variable_name);
          if_transitions = if_transitions.concat(tmp_transitions);
          last = 0;
        }
        else if (cursor.nodeType === 'simple_waveform_assignment') {
          let tmp_transitions = get_assignament_transitions(cursor.currentNode(), state_variable_name);
          if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
            assign_transitions = tmp_transitions;
            last_transitions = tmp_transitions;
            last = 1;
          }
        }
        else if (cursor.nodeType === 'simple_variable_assignment') {
          let tmp_transitions = get_assignament_variable_transitions(cursor.currentNode(), state_variable_name);
          if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
            assign_transitions = tmp_transitions;
            last_transitions = tmp_transitions;
            last = 1;
          }
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

function get_if_transitions(p, state_variable_name, metacondition) {
  let transitions = [];
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'elsif' || cursor.nodeType === 'else' || cursor.nodeType === 'if') {
      let transition = get_transition(cursor.currentNode(), state_variable_name, metacondition);
      if (transition !== undefined) {
        transitions = transitions.concat(transition);
      }
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return transitions;
}

function get_assignament_transitions(p, state_variable_name) {
  let transitions = [];

  let tmp_destination = check_get_simple_waveform_assignment(p, state_variable_name);
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

function get_assignament_variable_transitions(p, state_variable_name) {
  let transitions = [];

  let tmp_destination = check_get_simple_variable_assignment(p, state_variable_name);
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

function get_transition(p, state_variable_name, metacondition) {
  let result = get_condition(p);
  let condition = result.condition;
  let start_position = result.start_position;
  let end_position = result.end_position;
  let transitions = get_transitions_in_if(p, state_variable_name,
    condition, start_position, end_position, metacondition);
  return transitions;
}

function get_transitions_in_if(p, state_variable_name, condition, start_position, end_position, metacondition) {
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
          let tmp_destination = check_get_simple_waveform_assignment(cursor.currentNode(), state_variable_name);
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
          let tmp_destination = check_get_simple_variable_assignment(cursor.currentNode(), state_variable_name);
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
          last = 0;
          if_transitions = get_if_transitions(cursor.currentNode(), state_variable_name, condition);
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

function check_get_simple_waveform_assignment(p, state_variable_name) {
  let destination = undefined;
  if (get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
    destination = get_rigth_simple_waveform_assignment(p);
  }
  return destination;
}

function check_get_simple_variable_assignment(p, state_variable_name) {
  let destination = undefined;
  if (get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
    destination = get_rigth_simple_variable_assignment(p);
  }
  return destination;
}

function get_left_simple_waveform_assignment(p) {
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

function get_rigth_simple_waveform_assignment(p) {
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

function get_rigth_simple_variable_assignment(p) {
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

function get_condition(p) {
  let condition = '';
  let cursor = p.walk();
  let start_position = [];
  let end_position = [];
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'relation' || cursor.nodeType === 'logical_expression'
      || cursor.nodeType === 'parenthesized_expression') {
      if (cursor.nodeType === 'parenthesized_expression') {
        condition = get_relation_of_parenthesized_expression(cursor.currentNode());
      }
      else {
        condition = cursor.nodeText;
      }
      let s_position = cursor.startPosition;
      let e_position = cursor.endPosition;
      start_position = [s_position.row, s_position.column];
      end_position = [e_position.row, e_position.column];
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return {
    'condition': condition, 'start_position': start_position, 'end_position': end_position
  };
}

function get_relation_of_parenthesized_expression(p) {
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

function get_state_name(p) {
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


function get_state_variable_name(p) {
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

function get_case_process(p) {
  let case_statement = stm_base.search_multiple_in_tree(p, 'case_statement');
  return case_statement;
}


function get_process_label(p) {
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


function json_to_svg(stm_json) {
  let stmcat = get_smcat(stm_json);
  const smcat = require("state-machine-cat");
  let svg;
  try {
    svg = smcat.render(stmcat, { outputType: "svg" });
  }
  catch (e) { console.log(e); }
  return svg;
}

function get_smcat(stm_json) {
  let sm_states = '';
  let sm_transitions = '';

  let states = stm_json.states;
  let state_names = [];
  for (let i = 0; i < states.length; ++i) {
    if (states[i].transitions.length === 0) {
      state_names.push(states[i].name);
    }
  }
  let emptys = [];
  for (let i = 0; i < state_names.length; ++i) {
    let empty = true;
    for (let j = 0; j < states.length; ++j) {
      for (let m = 0; m < states[j].transitions.length; ++m) {
        if (states[j].transitions[m].destination === state_names[i]) {
          empty = false;
        }
      }
    }
    if (empty === true) {
      emptys.push(state_names[i]);
    }
  }

  let gosth = [];
  state_names = [];
  for (let i = 0; i < states.length; ++i) {
    state_names.push(states[i].name);
  }
  for (let j = 0; j < states.length; ++j) {
    for (let m = 0; m < states[j].transitions.length; ++m) {
      if (state_names.includes(states[j].transitions[m].destination) === false) {
        let element = { 'name': states[j].transitions[m].destination, 'transitions': [] };
        stm_json.states.push(element);
        gosth.push(states[j].transitions[m].destination);
      }
    }
  }
  let num_states = stm_json.states.length;
  stm_json.states.forEach(function (i_state, i) {
    let transitions = i_state.transitions;
    let state_name = i_state.name;
    if (emptys.includes(state_name) === true || gosth.includes(state_name) === true) {
      sm_states += `${state_name} [color="red"]`;
    }
    else {
      sm_states += `${state_name}`;
    }
    if (i !== num_states - 1) {
      sm_states += ',';
    }
    else {
      sm_states += ';\n';
    }
    if (gosth.includes(state_name) !== true) {
      transitions.forEach(function (i_transition, j) {
        if (gosth.includes(i_transition.destination) === true) {
          sm_transitions += `${state_name} => ${i_transition.destination} [color="red"] : ${i_transition.condition};\n`;
        }
        else {
          sm_transitions += `${state_name} => ${i_transition.destination} : ${i_transition.condition};\n`;
        }
      });
    }
  });
  let str_stm = stm_json.state_variable_name + "{\n" + sm_states + sm_transitions + "\n};";
  return str_stm;
}

module.exports = {
  get_svg_sm: get_svg_sm
};