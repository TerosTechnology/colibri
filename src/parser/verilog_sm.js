const stm_base = require('./stm_base_parser');

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
  let statement = stm_base.get_item_from_childs(p, 'statement');
  let statement_item = stm_base.get_item_from_childs(statement, 'statement_item');
  let procedural_timing_control_statement = stm_base.get_item_from_childs(statement_item, 'procedural_timing_control_statement');
  let statement_or_null = stm_base.get_item_from_childs(procedural_timing_control_statement, 'statement_or_null');
  let statement_2 = stm_base.get_item_from_childs(statement_or_null, 'statement');
  let statement_item_2 = stm_base.get_item_from_childs(statement_2, 'statement_item');
  let seq_block = stm_base.get_item_from_childs(statement_item_2, 'seq_block');

  return seq_block;
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
  let case_items = stm_base.get_item_multiple_from_childs(p, 'case_item');
  let case_state = [];
  for (let i = 0; i < case_items.length; ++i) {
    let state = {
      'name': '',
      'transitions': [],
      'start_position': [],
      'end_position': []
    };
    let result = stm_base.get_item_from_childs(case_items[i], 'case_item_expression');
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

function get_transitions(p, state_variable_name, metacondition) {
  let assign_transitions = [];
  let if_transitions = [];
  let last_transitions = [];
  let transitions = [];
  let skip = false;
  let last = 0;

  let statement_or_null;
  if (p.type !== 'statement_or_null') {
    statement_or_null = stm_base.get_item_from_childs(p, 'statement_or_null');
  }
  else {
    statement_or_null = p.walk().currentNode();
  }
  let statement = stm_base.get_item_from_childs(statement_or_null, 'statement');
  let statement_item = stm_base.get_item_from_childs(statement, 'statement_item');
  let seq_block = stm_base.get_item_from_childs(statement_item, 'seq_block');
  let itera_item = [];
  if (seq_block === undefined) {
    itera_item = [statement_item];
    skip = true;
  }
  else {
    itera_item = stm_base.get_item_multiple_from_childs(seq_block, 'statement_or_null');
  }
  for (let i = 0; i < itera_item.length; ++i) {
    let statement_item_2 = itera_item[i];
    if (skip === false) {
      let statement_2 = stm_base.get_item_from_childs(itera_item[i], 'statement');
      statement_item_2 = stm_base.get_item_from_childs(statement_2, 'statement_item');
    }
    //Search if
    let type;
    let block;
    let if_statement = stm_base.get_item_from_childs(statement_item_2, 'conditional_statement');
    if (if_statement === undefined) {
      //Search assignment
      let assign_statement = stm_base.get_item_from_childs(statement_item_2, 'blocking_assignment');
      if (assign_statement !== undefined) {
        type = 'simple_waveform_assignment';
        block = assign_statement;
      }
      else {
        let nonassign_statement = stm_base.get_item_from_childs(statement_item_2, 'nonblocking_assignment');
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
      let tmp_transitions = get_if_transitions(block, state_variable_name, metacondition);
      if_transitions = if_transitions.concat(tmp_transitions);
      last = 0;
    }
    else if (type === 'simple_waveform_assignment') {
      let tmp_transitions = get_assignament_transitions(block, state_variable_name, metacondition);
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
  //Set else condition
  let else_condition = '';
  for (let i = 0; i < ifs.length; ++i) {
    let condition = ifs[i].condition;
    if (condition !== '') {
      else_condition = `not (${condition})\n`;
    }
    else {
      ifs[i].condition = else_condition.slice(0, -1);
    }
  }

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
          let item = stm_base.get_item_from_childs(cursor.currentNode(), 'statement');
          let statement_item = stm_base.get_item_from_childs(item, 'statement_item');
          let statement_itemtt = stm_base.get_item_from_childs(item, 'statement_item');

          let block_item = stm_base.get_item_from_childs(statement_item, 'seq_block');
          if (block_item !== undefined) {
            item = stm_base.get_item_from_childs(block_item, 'statement_or_null');
            item = stm_base.get_item_from_childs(item, 'statement');
            statement_item = stm_base.get_item_from_childs(item, 'statement_item');
          }
          item = stm_base.get_item_from_childs(statement_item, 'conditional_statement');
          if (item !== undefined) {
            let tmp_ifs = get_if_elsif_else(item);
            ifs = ifs.concat(tmp_ifs);
          }
          else {
            let if_item_else = {
              'condition': '',
              'code': ''
            };

            let blocking_assignment = stm_base.get_item_from_childs(statement_item, 'blocking_assignment');
            if (blocking_assignment !== undefined) {
              if (block_item !== undefined) {
                if_item_else.code = block_item;
              }
              else {
                if_item_else.code = statement_item;
              }
              ifs.push(if_item_else);
            }
            else {
              let nonblocking_assignment = stm_base.get_item_from_childs(statement_item, 'nonblocking_assignment');
              if (nonblocking_assignment !== undefined) {
                if (block_item !== undefined) {
                  if_item_else.code = block_item;
                }
                else {
                  if_item_else.code = statement_item;
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
          let item = stm_base.get_item_from_childs(cursor.currentNode(), 'expression_or_cond_pattern');
          if (item !== undefined) {
            if_item.condition = item.text;
          }
        }
        else if (cursor.nodeType === 'statement_or_null') {
          let item = stm_base.get_item_from_childs(cursor.currentNode(), 'statement');
          item = stm_base.get_item_from_childs(item, 'statement_item');
          if (stm_base.get_item_from_childs(item, 'seq_block') !== undefined) {
            item = stm_base.get_item_from_childs(item, 'seq_block');
            // item = stm_base.get_item_from_childs(item, 'statement_or_null');
            // item = stm_base.get_item_from_childs(item, 'statement');
            // item = stm_base.get_item_from_childs(item, 'statement_item');
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

function get_assignament_transitions(p, state_variable_name, metacondition) {
  let transitions = [];

  let tmp_destination = check_get_simple_waveform_assignment(p, state_variable_name);
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

function get_transition(p, state_variable_name, metacondition) {
  let condition = p.condition;
  let tmp_start_position = p.code.startPosition;
  let tmp_end_position = p.code.endPosition;

  let start_position = [tmp_start_position.row, tmp_start_position.column];
  let end_position = [tmp_end_position.row, tmp_end_position.column];
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
      let if_transitions_tmp = get_if_transitions(cursor.currentNode(), state_variable_name, condition);
      if_transitions = if_transitions.concat(if_transitions_tmp);
    }
    else if (cursor.nodeType === 'statement_or_null') {
      last = 0;

      //check assignement
      let item = stm_base.get_item_from_childs(cursor.currentNode(), 'statement');
      item = stm_base.get_item_from_childs(item, 'statement_item');
      item_0 = stm_base.get_item_from_childs(item, 'blocking_assignment');
      item_1 = stm_base.get_item_from_childs(item, 'nonblocking_assignment');
      let if_item = true;
      if (item_0 !== undefined || item_1 !== undefined) {
        if_item = false;
      }
      if (metacondition !== undefined && metacondition !== '') {
        condition += `\n${metacondition}`;
      }

      let if_transitions_tmp = [];
      //check block if
      let item_block_if = stm_base.get_item_from_childs(item, 'conditional_statement');
      if (item_block_if === undefined) {
        if_transitions_tmp = get_transitions(cursor.currentNode(), state_variable_name, condition);
      }
      else {
        if_transitions_tmp = get_if_transitions(item_block_if, state_variable_name, condition);
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
  let item = stm_base.get_item_from_childs(p, 'operator_assignment');
  item = stm_base.get_item_from_childs(item, 'variable_lvalue');
  if (item !== undefined) {
    left = item.text;
  }
  if (left === '') {
    item = stm_base.get_item_from_childs(p, 'variable_lvalue');
    if (item !== undefined) {
      left = item.text;
    }
  }
  return left;
}

function get_rigth_simple_waveform_assignment(p) {
  let rigth = undefined;
  let item = stm_base.get_item_from_childs(p, 'operator_assignment');
  item = stm_base.get_item_from_childs(item, 'expression');
  if (item !== undefined) {
    rigth = item.text;
  }
  if (rigth === undefined) {
    item = stm_base.get_item_from_childs(p, 'expression');
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
  let case_expression = stm_base.get_item_from_childs(p, 'case_expression');
  if (case_expression !== undefined) {
    state_variable_name = case_expression.text;
  }
  return state_variable_name;
}

function get_case_process(p) {
  let case_statement = stm_base.search_multiple_in_tree(p, 'case_statement');
  return case_statement;
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
  // eslint-disable-next-line no-console
  catch (e) { console.log(e); }
  return svg;
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
