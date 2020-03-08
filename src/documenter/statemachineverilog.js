// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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

class StateMachineVerilog {
  getStateMachine(str) {
    var strDel = this.deleteComments(str);
    var body = this.getBody(strDel);
    var states = this.getStates(body);

    var go = ""
    for (let x = 0; x < states.length; ++x) {
      for (let i = 0; i < states[x]['transitions'].length; ++i) {
        if (states[x]['name'] !== "others" && states[x]['transitions'][i]['condition'] !== undefined) {
          go += states[x]['name'] + " => " + states[x]['transitions'][i]['transition'] + ": " +
            states[x]['transitions'][i]['condition'] + ";\n"
        }
      }
    }
    return go;
  }

  deleteComments(str) {
    str = str.replace(/\/\/(.+)/gi, '');
    return str;
  }

  getBody(str) {
    var regex = /[\t\n ]*\(*[A-Za-z_0-9]*[\t\n ]*\)*(.*)endcase/gsi;
    var body = regex.exec(str);
    return body[1];
  }

  getStates(str) {
    var regex = /[\t\n ]*(.+):/gim;
    var states = [];
    var result = regex.exec(str);
    var statesName = [];
    while (result !== null) {
      let state = {
        'name': result[1].replace(/ /gi, ''),
        'index': result['index'],
        'body': "",
        'transitions': []
      }
      states.push(state);
      statesName.push(result[1].replace(/ /gi, ''));
      result = regex.exec(str);
    }
    for (let x = 0; x < states.length - 1; ++x) {
      states[x]['body'] = str.substring(states[x]['index'], states[x + 1]['index']).replace(/[\t\n ]*(.+):/gim, '');
    }
    states[states.length - 1]['body'] = str.substring(states[states.length - 1]['index']);

    for (let x = 0; x < states.length - 1; ++x) {
      states[x].transitions = this.getMove(states[x]['body'], statesName);
    }

    return states;

  }

  getMove(str, main) {
    var cases = this.getCases(str);
    cases = this.getTransitions(cases, main);
    return cases;
  }

  getCases(str) {
    var regexIf = /[\t ]*(if|else if|else)(.+)*[\n\t ]/gim;
    var regexElse = /[\t ]*(else)(.+)*[\n\t ]/gim;
    var cases = [];

    var result = regexIf.exec(str);
    while (result !== null) {
      let condition = "";
      if (result[2] !== undefined) {
        condition = result[2].replace(/begin/gim, '');
      }
      let casel = {
        'condition': condition,
        'index': result['index'],
        'body': "",
        'transition': ""
      };
      cases.push(casel);
      result = regexIf.exec(str);
    }
    // result = regexElse.exec(str);
    // while(result !== null){
    //   let casel = {
    //     'condition' : result[2],
    //     'index' : result['index'],
    //     'body' : "",
    //     'transition' : ""
    //   };
    //   cases.push(casel);
    //   result = regexElse.exec(str);
    // }
    if (cases.length === 0) {
      let casel = {
        'condition': '',
        'index': 0,
        'body': str,
        'transition': ""
      };
      cases.push(casel);
    } else {
      for (let x = 0; x < cases.length - 1; ++x) {
        cases[x]['body'] = str.substring(cases[x]['index'], cases[x + 1]['index']).replace(/[\t ]*(if|else if|else)(.+)*[\n\t ]/gim, '');
      }
      cases[cases.length - 1]['body'] = str.substring(cases[cases.length - 1]['index']);
    }
    return cases;
  }

  getTransitions(cases, main) {
    for (let x = 0; x < cases.length; ++x) {
      let regex = /([A-Za-z_0-9]+)*[\t\n ]*(=|<=)*[\t\n ]*([A-Za-z_0-9']+)*[\t\n ]*;/gmi;
      let result = regex.exec(cases[x]['body'].replace(/#[0-9]+/gim, ''));
      while (result !== null) {
        for (let i = 0; i < main.length; ++i) {
          if (result[3].replace(/ /gi, '') == main[i]) {
            cases[x]['transition'] = result[3].replace(/ /gi, '');
          }
        }
        result = regex.exec(cases[x]['body'].replace(/#[0-9]+/gim, ''));
      }
    }
    return cases;
  }
}

module.exports = {
  StateMachineVerilog: StateMachineVerilog
}
