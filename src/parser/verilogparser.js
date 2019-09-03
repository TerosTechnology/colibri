const BaseParser = require('./parser')

class VerilogParser extends BaseParser {
  constructor() {
    super();
    this.REGEX = {
      'LIBRARY': /[\t\n ]*[`]{1}[i]{1}[n]{1}[c]{1}[l]{1}[u]{1}[d]{1}[e]{1}[\t\n ]*[\t\n ]*"*[\t\n ]*([a-zA-Z0-9_.]+)*[\t\n ]*"/g,
      'ENTITY': /[\t\n ]*[m]{1}[o]{1}[d]{1}[u]{1}[l]{1}[e]{1}[\t\n ]*[\t\n ]*([a-zA-Z0-9_]+)*[\t\n ]*[(]/g,
      'PORT': /[\t\n ]*(input|output){1}[\t ]*[\t \n]*([0-9_: [\]regwire]+){1}[\t ]*[\t \n]{1}[\t \n]*([A-Za-z0-9_,]+){1}[\t \n]*[=;]/g,
      'GENERIC': /[\t\n ]*parameter{1}[\t ]*[\t \n]*([,A-Za-z0-9_: [\]]+){1}[\t ]*[=;]/g,
      'REG': /^[(input|output|inout)]*[\t]*(reg|integer|time|realtime)+[\t ]*([[\]0-9:]+)*([[\]()A-Za-z0-9: _]+)*[;=]/mg,
      'NET': /^[(?!input|output|inout).]*[\t]*(wire|tri|wor|trior|wand|triand|tri0|tri1|supply0|supply1|supply1|trireg)+[\t ]*([[\]0-9:]+)*([[\]()A-Za-z0-9: _]+)*[;=]/mg,
      'CONSTANT': /[\t]*localparam*[\t ]*([[\]()_A-Za-z0-9: ]+)*[\t ]*[;=]/g
    }
  }
  getAll(str) {
    var structure = {
      'libraries': this.getLibraries(str),
      'entity': this.getEntityName(str),
      'generics': this.getGenerics(str),
      'ports': this.getPorts(str),
      'regs': this.getRegs(str),
      'nets': this.getNets(str),
      'constants': this.getConstants(str)
    };
    return structure;
  }
  getPorts(str) {
    var items = this.getItem(str, 0, this.REGEX['PORT']);
    return items;
  }
  getGenerics(str) {
    var items = this.getItem(str, 0, this.REGEX['GENERIC']);
    return items;
  }
  getRegs(str) {
    return this.getItem(str, 0, this.REGEX['REG']);
  }
  getNets(str) {
    return this.getItem(str, 0, this.REGEX['NET']);
  }
  getItem(str, offset, regex) {
    var resultItems = true;
    var items = [];
    while (resultItems) {
      resultItems = regex.exec(str);
      if (resultItems) {
        for (let line of Array.from(resultItems[3].split(','))) {
          let item = {
            'name': line,
            'kind': resultItems[1],
            'type': resultItems[2],
            'index': resultItems['index'] + offset
          };
          items.push(item);
        }
      }
    }
    return items;
  }
}

module.exports = VerilogParser
