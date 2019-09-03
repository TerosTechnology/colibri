const documenter = require('./documenter')

class VhdlStructure extends documenter.BaseStructure {}

class VhdlStateMachine extends documenter.BaseStateMachine {
  getStateMachine(str) {
    var strDel = this.deleteComments(str);
    var body = this.getBody(strDel);
    var states = this.getStates(body);

    var go = ""
    for (let x = 0; x < states.length; ++x) {
      for (let i = 0; i < states[x]['transitions'].length; ++i) {
        if (states[x]['name'] !== "others") {
          if (states[x]['transitions'][i]['condition'] == undefined) {
            go += states[x]['name'] + " => " + states[x]['transitions'][i]['transition'] + ": " +
              '' + ";\n"
          } else {
            go += states[x]['name'] + " => " + states[x]['transitions'][i]['transition'] + ": " +
              states[x]['transitions'][i]['condition'] + ";\n"
          }
        }
      }
    }
    return go;
  }

  deleteComments(str) {
    str = str.replace(/--(.+)/gi, '');
    return str;
  }

  getBody(str) {
    var regex = /is([\s\S]*?)end case/gi;
    var body = regex.exec(str);
    return body[1];
  }

  getStates(str) {
    var regex = /when*[\n\t ]*(.+)*[\n\t ]*=>/gim;
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
      states[x]['body'] = str.substring(states[x]['index'], states[x + 1]['index']).replace(/when*[\n\t ]*(.+)*[\n\t ]*=>/gim, '');
    }
    states[states.length - 1]['body'] = str.substring(states[states.length - 1]['index']);
    for (let x = 0; x < states.length; ++x) {
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
    var regexIf = /[\t ]*(if|elsif)(.+)*[\n\t ]*then/gim;
    var regexElse = /(else |else\n)/gim;
    var cases = [];

    var result = regexIf.exec(str);
    while (result !== null) {
      let casel = {
        'else': false,
        'condition': result[2],
        'index': result['index'],
        'body': "",
        'transition': ""
      };
      cases.push(casel);
      result = regexIf.exec(str);
    }
    result = regexElse.exec(str);
    while (result !== null) {
      let casel = {
        'else': true,
        'condition': result[2],
        'index': result['index'],
        'body': "",
        'transition': ""
      };
      cases.push(casel);
      result = regexElse.exec(str);
    }
    if (cases.length === 0) {
      let casel = {
        'else': false,
        'condition': '',
        'index': 0,
        'body': str,
        'transition': ""
      };
      cases.push(casel);
    } else {
      for (let x = 0; x < cases.length - 1; ++x) {
        cases[x]['body'] = str.substring(cases[x]['index'], cases[x + 1]['index']).replace(/[\t ]*(if|elsif)(.+)*[\n\t ]*then/gim, '');
      }
      if (cases[cases.length - 1]['else'] == false) {
        cases[cases.length - 1]['body'] = str.substring(cases[cases.length - 1]['index']);
        cases[cases.length - 1]['body'] = cases[cases.length - 1]['body'].replace(/[\t ]*(if|elsif)(.+)*[\n\t ]*then/gim, '');
        cases[cases.length - 1]['body'] = cases[cases.length - 1]['body'].replace(/(end if)/gim, '');
      } else {
        cases[cases.length - 1]['body'] = str.substring(cases[cases.length - 1]['index']);
        cases[cases.length - 1]['body'] = cases[cases.length - 1]['body'].replace(/(else |else\n)/gim, '');
        cases[cases.length - 1]['body'] = cases[cases.length - 1]['body'].replace(/(end if)/gim, '');
      }
    }
    return cases;
  }

  getTransitions(cases, main) {
    for (let x = 0; x < cases.length; ++x) {
      let regex = /([A-Za-z0-9_]+)*[\t\n ]*(<=|< =|:=|: =){1}[]*[\t\n ]*([A-Za-z0-9_]+)*[\t\n ]*;/gmi;
      let result = regex.exec(cases[x]['body']);
      while (result !== null) {
        for (let i = 0; i < main.length; ++i) {
          if (result[3] == main[i]) {
            cases[x]['transition'] = result[3];
          }
        }
        result = regex.exec(cases[x]['body']);
      }
    }
    return cases;
  }
}

module.exports = {
  VhdlStructure: VhdlStructure,
  VhdlStateMachine: VhdlStateMachine,
}
