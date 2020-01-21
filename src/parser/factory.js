const codes = require('../db/codes')
const db_manager = require('../db/db_manager')

const VhdlParser = require('./vhdlparser')
const VerilogParser = require('./verilogparser')


class ParserFactory {
  getConfiguredParser() {
    let parser = db_manager.getActiveParserCode();
    if (typeof parser !== 'undefined' && parser !== null) {
      if (parser == codes.Parsers.VHDL) {
        return this.getVhdlParser();
      } else if (parser == codes.Parsers.VERILOG) {
        return this.getVerilogParser();
      }
    }
  }

  getVhdlParser() {
    return new VhdlParser();
  }

  getVerilogParser() {
    return new tsVerilogParser();
  }
}

var instance = new ParserFactory();
module.exports = instance
