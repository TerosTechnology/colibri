const codes = require('../db/codes')
const db_manager = require('../db/db_manager')

const vhdl = require('./vhdldocumenter')
const verilog = require('./verilogdocumenter')


class DocumenterFactory {
  getConfiguredStructure(structure) {
    let documenter = db_manager.getActiveDocumenterCode();
    if (typeof documenter !== 'undefined' && documenter !== null) {
      if (documenter == codes.Documenters.VHDL) {
        return this.getVhdlStructure(structure);
      } else if (documenter == codes.Documenters.VERILOG) {
        return this.getVerilogStructure(structure);
      }
    }
  }

  getConfiguredStateMachine() {
    let documenter = db_manager.getActiveDocumenterCode();
    if (typeof documenter !== 'undefined' && documenter !== null) {
      if (documenter == codes.Documenters.VHDL) {
        return this.getVhdlStateMachine();
      } else if (documenter == codes.Documenters.VERILOG) {
        return this.getVerilogStateMachine();
      }
    }
  }

  getVhdlStructure(structure) {
    return new vhdl.VhdlStructure(structure);
  }

  getVerilogStructure(structure) {
    return new verilog.VerilogStructure(structure);
  }

  getVhdlStateMachine() {
    return new vhdl.VhdlStateMachine();
  }

  getVerilogStateMachine() {
    return new verilog.VerilogStateMachine();
  }

}

var instance = new DocumenterFactory();
module.exports = instance
