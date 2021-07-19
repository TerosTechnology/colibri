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
const ts_base_parser = require('./ts_base_parser');

class Parser_stm_base extends ts_base_parser.Ts_base_parser {
  constructor() {
    super();
  }

  check_empty_states_transitions(states) {
    let check = true;
    for (let i = 0; i < states.length; ++i) {
      if (states[i].transitions.length !== 0) {
        check = false;
      }
    }
    return check;
  }

  check_stm(stm) {
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

  json_to_svg(stm_json) {
    let stmcat = this.get_smcat(stm_json);
    const smcat = require("state-machine-cat");
    let svg;
    try {
      console.error = function() {};
      svg = smcat.render(stmcat, { outputType: "svg" });
    }
    // eslint-disable-next-line no-empty
    catch (e) {  }
    return svg;
  }

  get_smcat(stm_json) {
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
            sm_transitions +=
              `${state_name} => ${i_transition.destination} [color="red"] : ${i_transition.condition};\n`;
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

  only_unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  get_comment(comment){
    if (comment === undefined){
      return '';
    }
    let txt_comment = comment.slice(2);
    if (this.comment_symbol === '') {
      return txt_comment + '\n';
    }
    else if (txt_comment[0] === this.comment_symbol) {
      return txt_comment.slice(1).trim() + '\n';
    }
    return '';
  }

  set_symbol(symbol){
    if (symbol === undefined) {
      this.comment_symbol = '';
    }
    else{
      this.comment_symbol = symbol;
    }
  }

}

module.exports = {
  Parser_stm_base: Parser_stm_base
};