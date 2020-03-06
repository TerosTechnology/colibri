const BaseParser = require('./parser')

class VhdlParser extends BaseParser {
  constructor() {
    super();
    this.REGEX = {
      'LIBRARY': /[\t ]*use*[\t\n ]*([a-zA-Z0-9_.]+)*[\t \n]*;/ig,
      'ENTITY': /[\t ]*entity+[\t\n ]*([a-zA-Z0-9_]+)/ig,
      'ARCHITECTURE': /[ \t]*architecture[ \t]+([^ ]+) of/ig,
      'PORTS0': /[\t ]*port*\(*[\t]*([,/\t\n A-Za-z!?¿:_=';\-0-9()>]+)\);*[\t \n]*end/ig,
      'PORTS1': /[\t ]*port*\(*[\t]*([,/\t\n A-Za-z:!?¿_=';\-0-9()>]+)\);*[\t \n]*generic/ig,
      'PORT': /[\t ]*([A-Za-z0-9_, \t]+){1}[\t ]*[\t \n]*[:]{1}[\t ]*[\t \n]*(in|out|inout){1}[\t ]*[\t \n]*([- \t()A-Za-z0-9_']+){1}[\t ]*[\n\t ]*(--|;|:)/g,
      'GENERICS0': /[\t ]*generic*\(*[\t]*([,/\t\n A-Za-z!?¿:_=';\-0-9()>]+)\);*[\t \n]*port/ig,
      'GENERICS1': /[\t ]*generic*\(*[\t]*([,/\t\n A-Za-z!?¿:_=';\-0-9()>]+)\);*[\t \n]*end/ig,
      'GENERIC': /[\t ]*([A-Za-z0-9_, \t]+){1}[\t ]*[\t \n]*[:]{1}[\t ]*[\t \n]*[\t \n]*([- \t()A-Za-z0-9_']+){1}[\t\n ]*(;|:)/g,
      'SIGNAL': /[\t ]*signal*[\n\t ]*([a-zA-Z0-9_\t ,]+)*[\t\n ]*:+[\t\n ]*([- ()\tA-Za-z0-9_']+)*[\t\n ]*[;= :]/gi,
      'CONSTANT': /[\t ]*constant*[\n\t ]*([a-zA-Z0-9_\t ,]+)*[\t\n ]*:+[\t\n ]*([- ()\tA-Za-z0-9_']+)*[\t\n ]*[;= :]/ig,
      'TYPE': /[\n\t ;]{1}[\t\n ]*type*[\t\n ]*([a-zA-Z0-9_]+)*[\n\t ]*is*[\t\n ]*([-() \n\t,A-Za-z_0-9]+)*;/ig,
      'PROCESS': /[ \t]*([^ \t:]+)[ \t\n]*:[ \t\n]*process[ \t\n]*/ig
    }
  }
  getAll(str) {
    var structure = {
      'libraries': this.getLibraries(str),
      'entity': this.getEntityName(str),
      'generics': this.getGenerics(str),
      'ports': this.getPorts(str),
      'architecture': this.getArchitectureName(str),
      'signals': this.getSignals(str),
      'constants': this.getConstants(str),
      'types': this.getTypes(str),
      'process': this.getProcess(str)
    };
    return structure;
  }
  getArchitectureName(str) {
    var result = this.REGEX['ARCHITECTURE'].exec(str);
    if (result == null) {
      return [];
    }
    let item = {
      'name': result[1],
      'index': result['index']
    };
    return item;
  }
  getPorts(str) {
    str = this.deleteComments(str);
    var items = this.REGEX['PORTS0'].exec(str);
    if (items == null) {
      return []
    }
    return this.getItem(items[1].replace(/--/gi, ";")+";", items['index'], this.REGEX['PORT']);
  }
  getGenerics(str) {
    str = this.deleteComments(str);
    var items = this.REGEX['GENERICS0'].exec(str);
    if (items == null) {
      return []
    }
    return this.getItemGeneric(items[1].replace(/--/gi, ";")+";", items['index'], this.REGEX['GENERIC']);
  }
  getSignals(str) {
    return this.getItem(str, 0, this.REGEX['SIGNAL']);
  }
  getTypes(str) {
    return this.getItem(str, 0, this.REGEX['TYPE']);
  }
  getProcess(str) {
    var items = []
    var result = this.REGEX['PROCESS'].exec(str);
    while (result) {
      let item = {
        'name': result[1],
        'index': result['index']
      };
      items.push(item);
      result = this.REGEX['PROCESS'].exec(str);
    }
    return items;
  }
  getItem(str, offset, regex) {
    var resultItems = true;
    var items = [];
    while (resultItems) {
      resultItems = regex.exec(str);
      if (resultItems) {
        for (let line of Array.from(resultItems[1].split(','))) {
          let item = {
            'name': line,
            'direction': resultItems[2],
            'type': resultItems[3],
            'index': resultItems['index'] + offset,
            'comment' : ""
          };
          items.push(item);
        }
      }
    }
    return items;
  }
  getItemGeneric(str, offset, regex) {
    var resultItems = true;
    var items = [];
    while (resultItems) {
      resultItems = regex.exec(str);
      if (resultItems) {
        for (let line of Array.from(resultItems[1].split(','))) {
          let item = {
            'name': line,
            'type': resultItems[2],
            'index': resultItems['index'] + offset
          };
          items.push(item);
        }
      }
    }
    return items;
  }
  deleteComments(str) {
    str = str.replace(/--(.+)/gi, '');
    return str;
  }
}


module.exports =  VhdlParser
