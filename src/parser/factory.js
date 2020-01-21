const general = require('../general/general')
const VhdlParser = require('./vhdlparser')
const tsVerilogParser = require('./tsVerilogParser')


class ParserFactory {
  constructor() {}

  getParser(lang) {
    if (lang == 'vhdl') {
      return this.getVhdlParser();
    } else if (lang == 'verilog') {
      return this.getVerilogParser();
    }
  }

  getVhdlParser() {
    return new VhdlParser();
  }

  getVerilogParser() {
    return new tsVerilogParser();
  }
}

module.exports = {
  ParserFactory: ParserFactory
}
