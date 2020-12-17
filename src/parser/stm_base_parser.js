class Parser_stm_base {
  search_multiple_in_tree(element, matchingTitle) {
    var arr_match = [];
    function recursive_searchTree(element, matchingTitle) {
      let type = element.type;
      if (type === matchingTitle) {
        arr_match.push(element);
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matchingTitle);
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matchingTitle);
    return arr_match;
  }

  search_in_tree(element, matchingTitle) {
    var match = undefined;
    function recursive_searchTree(element, matchingTitle) {
      let type = element.type;
      if (type === matchingTitle) {
        match = element;
      } else if (element !== null) {
        var i;
        var result = null;
        for (i = 0; result === null && i < element.childCount; i++) {
          result = recursive_searchTree(element.child(i), matchingTitle);
          if (result !== null) {
            break;
          }
        }
        return result;
      }
      return null;
    }
    recursive_searchTree(element, matchingTitle);
    return match;
  }

  get_item_multiple_from_childs(p, type) {
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

  get_item_from_childs(p, type) {
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

  json_to_svg(stm_json) {
    let stmcat = this.get_smcat(stm_json);
    const smcat = require("state-machine-cat");
    let svg;
    try {
      svg = smcat.render(stmcat, { outputType: "svg" });
    }
    // eslint-disable-next-line no-console
    catch (e) { console.log(e); }
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

}

module.exports = {
  Parser_stm_base: Parser_stm_base
};