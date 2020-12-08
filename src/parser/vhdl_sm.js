
const Path = require('path');
const Parser = require('web-tree-sitter');

async function get_svg_sm(code, comment_symbol) {
  await Parser.init();
  const parser = new Parser();
  let Lang = await
    Parser.Language.load(Path.join(__dirname, Path.sep + "parsers" + Path.sep + "tree-sitter-vhdl.wasm"));
  parser.setLanguage(Lang);

  const tree = parser.parse(code);
  let process = get_process(tree, comment_symbol);
  let stm = [];
  let svg = [];
  for (let i = 0; i < process.length; ++i) {
    let state = get_process_info(process[i]);
    if (state !== undefined) {
      if (check_stm(state) === true) {
        stm.push(state);
        let svg_tmp = json_to_svg(state);
        let stm_tmp = {
          'svg': svg_tmp,
          'description': state.description
        };
        svg.push(stm_tmp);
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
  let break_p = false;
  let counter = 0;
  let arch_body = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'design_unit') {
      counter += 1;
      if (counter === 2) {
        cursor.gotoFirstChild();
        do {
          if (cursor.nodeType === 'architecture_body') {
            cursor.gotoFirstChild();
            do {
              if (cursor.nodeType === 'concurrent_statement_part') {
                arch_body = cursor.currentNode();
                break_p = true;
              }
            }
            while (cursor.gotoNextSibling() === true && break_p === false);
          }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
      }
    }
  }
  while (cursor.gotoNextSibling() === true && break_p === false);
  return arch_body;
}

function get_process_info(proc) {
  let p_info = {
    'description': proc.comments,
    'name': '',
    'state_variable_name': '',
    'states': []
  };
  let p = proc.code;
  p_info.name = get_process_label(p);
  let case_statement = get_case_process(p);

  if (case_statement !== undefined) {
    p_info.state_variable_name = get_state_variable_name(case_statement);
    p_info.states = get_states(case_statement, p_info.state_variable_name);
  }
  else {
    return undefined;
  }
  return p_info;
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
      state.name = result.state_name;
      state.start_position = result.start_position;
      state.end_position = result.end_position;
      state.transitions = get_transitions(cursor.currentNode(), state_variable_name);

      case_state.push(state);
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
          assign_transitions = tmp_transitions;
          last_transitions = tmp_transitions;
          last = 1;
        }
        else if (cursor.nodeType === 'simple_variable_assignment') {
          let tmp_transitions = get_assignament_variable_transitions(cursor.currentNode(), state_variable_name);
          assign_transitions = tmp_transitions;
          last_transitions = tmp_transitions;
          last = 1;
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

function get_if_transitions(p, state_variable_name) {
  let transitions = [];
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'elsif' || cursor.nodeType === 'else' || cursor.nodeType === 'if') {
      let transition = get_transition(cursor.currentNode(), state_variable_name);
      if (transition !== undefined) {
        transitions.push(transition);
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

function get_transition(p, state_variable_name) {
  let transition = undefined;
  let result = get_condition(p);
  let condition = result.condition;
  let start_position = result.start_position;
  let end_position = result.end_position;
  let destination = get_destination(p, state_variable_name);
  if (condition !== undefined && destination !== undefined) {
    transition = {
      'condition': '',
      'destination': '',
      'start_position': start_position,
      'end_position': end_position
    };
    transition.condition = condition;
    transition.destination = destination;
  }
  return transition;
}

function get_destination(p, state_variable_name) {
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
          }
        }
        else if (cursor.nodeType === 'simple_variable_assignment') {
          let tmp_destination = check_get_simple_variable_assignment(cursor.currentNode(), state_variable_name);
          if (tmp_destination !== undefined) {
            destination = tmp_destination;
          }
        }
        else if (cursor.nodeType === 'if_statement') {
          let pepe = get_if_transitions(cursor.currentNode(), state_variable_name);
          console.log('hola');
        }
      }
      while (cursor.gotoNextSibling() !== false);
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return destination;
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
      condition = cursor.nodeText;
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
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'sequence_of_statements') {
      case_statement = get_raw_case_process(cursor.currentNode());
      if (case_statement === undefined) {
        case_statement = get_if_case_process(cursor.currentNode());
        if (case_statement === undefined) {
          case_statement = get_if_case_process_2(cursor.currentNode());
        }
      }
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_statement;
}

function get_raw_case_process(p) {
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'case_statement') {
      case_statement = cursor.currentNode();
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_statement;
}

function get_if_case_process(p) {
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'if_statement') {
      cursor.gotoFirstChild();
      do {
        if (cursor.nodeType === 'elsif' || cursor.nodeType === 'else' || cursor.nodeType === 'if') {
          let tmp_case_statement = search_case_in_if(cursor.currentNode());
          if (tmp_case_statement !== undefined) {
            case_statement = tmp_case_statement;
          }
        }
      }
      while (cursor.gotoNextSibling() !== false);
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_statement;
}

function get_if_case_process_2(p) {
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'if_statement') {
      cursor.gotoFirstChild();
      do {
        if (cursor.nodeType === 'elsif' || cursor.nodeType === 'else' || cursor.nodeType === 'if') {
          let sequence_of_statements = get_sequence_of_statements(cursor.currentNode());
          if (sequence_of_statements !== undefined) {
            let tmp_case_statement = get_if_case_process(sequence_of_statements);
            if (tmp_case_statement !== undefined) {
              case_statement = tmp_case_statement;
            }
          }
        }
      }
      while (cursor.gotoNextSibling() !== false);
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_statement;
}

function get_sequence_of_statements(p) {
  let sequence_of_statements = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'sequence_of_statements') {
      sequence_of_statements = cursor.currentNode();
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return sequence_of_statements;
}


function search_case_in_if(p) {
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'sequence_of_statements') {
      cursor.gotoFirstChild();
      do {
        if (cursor.nodeType === 'case_statement') {
          case_statement = cursor.currentNode();
        }
      }
      while (cursor.gotoNextSibling() !== false);
    }
  }
  while (cursor.gotoNextSibling() !== false);
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
  let svg = smcat.render(stmcat, { outputType: "svg" });
  return svg;
}

function get_smcat(stm_json) {
  let sm_states = '';
  let sm_transitions = '';
  let num_states = stm_json.states.length;

  stm_json.states.forEach(function (i_state, i) {
    let transitions = i_state.transitions;
    let state_name = i_state.name;
    sm_states += `${state_name}`;
    if (i !== num_states - 1) {
      sm_states += ',';
    }
    else {
      sm_states += ';\n';
    }
    transitions.forEach(function (i_transition, j) {
      sm_transitions += `${state_name} => ${i_transition.destination} : ${i_transition.condition};\n`;
    });
  });
  let str_stm = stm_json.state_variable_name + "{\n" + sm_states + sm_transitions + "\n};";
  return str_stm;
}

module.exports = {
  get_svg_sm: get_svg_sm
};