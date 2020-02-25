const general = require('../general/general')
const VhdlParser = require('./vhdlparser')
const tsVerilogParser = require('./tsVerilogParser')
const vunitVhdlParser = require('./vunitVhdlParser')


class ParserFactory {
  constructor() {}

  getParser(lang,comment_symbol) {
    if (lang == 'vhdl') {
      return this.getVhdlParser(comment_symbol);
    } else if (lang == 'verilog') {
      return this.getVerilogParser(comment_symbol);
    }
  }

  getVhdlParser(comment_symbol) {
    return new vunitVhdlParser(comment_symbol);
  }

  getVerilogParser(comment_symbol) {
    return new tsVerilogParser(comment_symbol);
  }
}

module.exports = {
  ParserFactory: ParserFactory
}
