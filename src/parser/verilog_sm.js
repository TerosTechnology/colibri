const Path = require('path');
const Parser = require('web-tree-sitter');

async function get_svg_sm(code, comment_symbol) {
  await Parser.init();
  const parser = new Parser();
  let Lang = await
    Parser.Language.load(Path.join(__dirname, Path.sep + "parsers" + Path.sep + "tree-sitter-verilog.wasm"));
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
    let state;
    try {
      state = get_process_info(process[i]);
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      state = undefined;
    }
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
    if (cursor.nodeType === 'module_or_generate_item') {
      cursor.gotoFirstChild();
      do {
        if (cursor.nodeType === 'always_construct') {
          let process = {
            'code': get_deep_process(cursor.currentNode()),
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

function get_deep_process(p) {
  let statement = get_item_from_childs(p, 'statement');
  let statement_item = get_item_from_childs(statement, 'statement_item');
  let procedural_timing_control_statement = get_item_from_childs(statement_item, 'procedural_timing_control_statement');
  let statement_or_null = get_item_from_childs(procedural_timing_control_statement, 'statement_or_null');
  let statement_2 = get_item_from_childs(statement_or_null, 'statement');
  let statement_item_2 = get_item_from_childs(statement_2, 'statement_item');
  let seq_block = get_item_from_childs(statement_item_2, 'seq_block');

  return seq_block;
}

function get_item_from_childs(p, type) {
  if (p === undefined) {
    return undefined;
  }
  let item = undefined;
  let cursor = p.walk();
  let break_p = false;
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === type) {
      item = cursor.currentNode();
      break_p = true;
    }
  }
  while (cursor.gotoNextSibling() === true && break_p === false);
  return item;
}


function get_architecture_body(p) {
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

function get_process_info(proc) {
  let p_info = {
    'description': proc.comments,
    'name': '',
    'state_variable_name': '',
    'states': []
  };
  let p = proc.code;
  let name = get_process_label(p);
  p_info.name = name;
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
  let case_items = get_item_multiple_from_childs(p, 'case_item');
  let case_state = [];
  for (let i = 0; i < case_items.length; ++i) {
    let state = {
      'name': '',
      'transitions': [],
      'start_position': [],
      'end_position': []
    };
    let result = get_item_from_childs(case_items[i], 'case_item_expression');
    if (result !== undefined && result.text !== 'default') {
      state.name = result.text;
      state.start_position = [result.startPosition.row, result.startPosition.column];
      state.end_position = [result.endPosition.row, result.endPosition.column];
      state.transitions = get_transitions(case_items[i], state_variable_name);

      case_state.push(state);
    }
  }
  return case_state;
}

function get_transitions(p, state_variable_name) {
  let assign_transitions = [];
  let if_transitions = [];
  let last_transitions = [];
  let transitions = [];
  let skip = false;
  let last = 0;

  let statement_or_null = get_item_from_childs(p, 'statement_or_null');
  let statement = get_item_from_childs(statement_or_null, 'statement');
  let statement_item = get_item_from_childs(statement, 'statement_item');
  let seq_block = get_item_from_childs(statement_item, 'seq_block');
  let itera_item = [];
  if (seq_block === undefined) {
    itera_item = [statement_item];
    skip = true;
  }
  else {
    itera_item = get_item_multiple_from_childs(seq_block, 'statement_or_null');
  }
  for (let i = 0; i < itera_item.length; ++i) {
    let statement_item_2 = itera_item[i];
    if (skip === false) {
      let statement_2 = get_item_from_childs(itera_item[i], 'statement');
      statement_item_2 = get_item_from_childs(statement_2, 'statement_item');
    }
    //Search if
    let type;
    let block;
    let if_statement = get_item_from_childs(statement_item_2, 'conditional_statement');
    if (if_statement === undefined) {
      //Search assignment
      let assign_statement = get_item_from_childs(statement_item_2, 'blocking_assignment');
      if (assign_statement !== undefined) {
        type = 'simple_waveform_assignment';
        block = assign_statement;
      }
      else {
        let nonassign_statement = get_item_from_childs(statement_item_2, 'nonblocking_assignment');
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
      let tmp_transitions = get_if_transitions(block, state_variable_name);
      if_transitions = if_transitions.concat(tmp_transitions);
      last = 0;
    }
    else if (type === 'simple_waveform_assignment') {
      let tmp_transitions = get_assignament_transitions(block, state_variable_name);
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

function get_if_transitions(p, state_variable_name, metacondition) {
  let transitions = [];
  let ifs = get_if_elsif_else(p);
  for (let i = 0; i < ifs.length; ++i) {
    let transition = get_transition(ifs[i], state_variable_name, metacondition);
    if (transition !== undefined) {
      transitions = transitions.concat(transition);
    }
  }
  return transitions;
}

function get_if_elsif_else(p) {
  let ifs = [];
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'else') {
      let break_p = false;
      while (break_p === false && cursor.gotoNextSibling() !== false) {
        if (cursor.nodeType === 'statement_or_null') {
          let item = get_item_from_childs(cursor.currentNode(), 'statement');
          let statement_item = get_item_from_childs(item, 'statement_item');
          item = get_item_from_childs(statement_item, 'conditional_statement');
          if (item !== undefined) {
            let tmp_ifs = get_if_elsif_else(item);
            ifs = ifs.concat(tmp_ifs);
          }
          else {
            let if_item_else = {
              'condition': '',
              'code': ''
            };
            let blocking_assignment = get_item_from_childs(statement_item, 'blocking_assignment');
            if (blocking_assignment !== undefined) {
              if_item_else.code = statement_item;
              ifs.push(if_item_else);
            }
            else {
              let nonblocking_assignment = get_item_from_childs(statement_item, 'nonblocking_assignment');
              if (nonblocking_assignment !== undefined) {
                if_item_else.code = statement_item;
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
          let item = get_item_from_childs(cursor.currentNode(), 'expression_or_cond_pattern');
          if (item !== undefined) {
            if_item.condition = item.text;
          }
        }
        else if (cursor.nodeType === 'statement_or_null') {
          let item = get_item_from_childs(cursor.currentNode(), 'statement');
          item = get_item_from_childs(item, 'statement_item');
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
      'condition': '',
      'destination': destination,
      'start_position': start_position,
      'end_position': end_position
    };
    transitions.push(transition);
  }
  return transitions;
}

function get_transition(p, state_variable_name, metacondition) {
  let condition = p.condition;
  // let start_position = result.start_position;
  // let end_position = result.end_position;
  //todo
  let start_position = [];
  let end_position = [];
  let transitions = get_transitions_in_if(p.code, state_variable_name,
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
    if (cursor.nodeType === 'blocking_assignment' || cursor.nodeType === 'nonblocking_assignment') {
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
    else if (cursor.nodeType === 'conditional_statement') {
      last = 0;
      if_transitions = get_if_transitions(cursor.currentNode(), state_variable_name, condition);
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
  let left = get_left_simple_waveform_assignment(p);
  if (left === state_variable_name) {
    destination = get_rigth_simple_waveform_assignment(p);
  }
  return destination;
}

function check_get_simple_variable_assignment(p, state_variable_name) {
  let destination = undefined;
  let left = get_left_simple_waveform_assignment(p);
  if (left === state_variable_name) {
    destination = get_rigth_simple_variable_assignment(p);
  }
  return destination;
}

function get_left_simple_waveform_assignment(p) {
  let left = '';
  let item = get_item_from_childs(p, 'operator_assignment');
  item = get_item_from_childs(item, 'variable_lvalue');
  if (item !== undefined) {
    left = item.text;
  }
  if (left === '') {
    item = get_item_from_childs(p, 'variable_lvalue');
    if (item !== undefined) {
      left = item.text;
    }
  }
  return left;
}

function get_rigth_simple_waveform_assignment(p) {
  let rigth = undefined;
  let item = get_item_from_childs(p, 'operator_assignment');
  item = get_item_from_childs(item, 'expression');
  if (item !== undefined) {
    rigth = item.text;
  }
  if (rigth === undefined) {
    item = get_item_from_childs(p, 'expression');
    if (item !== undefined) {
      rigth = item.text;
    }
  }
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

function get_state_variable_name(p) {
  let state_variable_name = undefined;
  let case_expression = get_item_from_childs(p, 'case_expression');
  if (case_expression !== undefined) {
    state_variable_name = case_expression.text;
  }
  return state_variable_name;
}

function get_case_process(p) {
  let case_statement = undefined;
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === 'statement_or_null') {
      case_statement = get_raw_case_process(cursor.currentNode());
      if (case_statement === undefined) {
        case_statement = get_if_case_process(cursor.currentNode());
      }
    }
  }
  while (cursor.gotoNextSibling() !== false);
  return case_statement;
}

function get_raw_case_process(p) {
  let statement = get_item_from_childs(p, 'statement');
  let statement_item = get_item_from_childs(statement, 'statement_item');
  let case_statement = get_item_from_childs(statement_item, 'case_statement');
  return case_statement;
}

function get_if_case_process(p) {
  let statement = get_item_from_childs(p, 'statement');
  let statement_item = get_item_from_childs(statement, 'statement_item');
  let conditional_statement = get_item_from_childs(statement_item, 'conditional_statement');
  let statement_or_null = get_item_multiple_from_childs(conditional_statement, 'statement_or_null');
  let case_statement = undefined;
  for (let i = 0; i < statement_or_null.length && case_statement === undefined; ++i) {
    let statement_2 = get_item_from_childs(statement_or_null[i], 'statement');
    let statement_item_2 = get_item_from_childs(statement_2, 'statement_item');
    case_statement = get_item_from_childs(statement_item_2, 'case_statement');
    if (case_statement === undefined) {
      let case_if = get_item_from_childs(statement_item_2, 'conditional_statement');
      if (case_if !== undefined && case_if !== []) {
        case_statement = get_if_case_deep_process(case_if);
      }
    }
  }
  return case_statement;
}


function get_if_case_deep_process(p) {
  let statement_or_null = get_item_multiple_from_childs(p, 'statement_or_null');
  let case_statement = undefined;
  for (let i = 0; i < statement_or_null.length && case_statement === undefined; ++i) {
    let statement_2 = get_item_from_childs(statement_or_null[i], 'statement');
    let statement_item_2 = get_item_from_childs(statement_2, 'statement_item');
    case_statement = get_item_from_childs(statement_item_2, 'case_statement');
    if (case_statement === undefined) {
      let case_if = get_item_from_childs(statement_item_2, 'conditional_statement');
      if (case_if !== undefined) {
        case_statement = get_if_case_deep_process(case_if);
      }
    }
  }
  return case_statement;
}

function get_item_multiple_from_childs(p, type) {
  if (p === undefined) {
    return [];
  }
  let items = [];
  let cursor = p.walk();
  cursor.gotoFirstChild();
  do {
    if (cursor.nodeType === type) {
      let item = cursor.currentNode();
      items.push(item);
    }
  }
  while (cursor.gotoNextSibling() === true);
  return items;
}

function get_process_label(p) {
  let label = '';
  // let cursor = p.walk();
  // //Process label
  // cursor.gotoFirstChild();
  // if (cursor.nodeType === 'label') {
  //   cursor.gotoFirstChild();
  //   label = cursor.nodeText;
  // }
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
  let num_states = stm_json.states.length;

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

  stm_json.states.forEach(function (i_state, i) {
    let transitions = i_state.transitions;
    let state_name = i_state.name;
    if (emptys.includes(state_name)) {
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
    transitions.forEach(function (i_transition, j) {
      sm_transitions += `${state_name} => ${i_transition.destination} : ${i_transition.condition};\n`;
    });
  });
  let str_stm = stm_json.state_variable_name + "{\n" + sm_states + sm_transitions + "\n};";
  console.log("hola")
  console.log(str_stm)
  return str_stm;
}

module.exports = {
  get_svg_sm: get_svg_sm
};
