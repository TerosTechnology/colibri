const codes = require('../db/codes')
const db_manager = require('../db/db_manager')

const VhdlEditor = require('./vhdleditor')
const VerilogEditor = require('./verilogeditor')


class EditorFactory {
  getConfiguredEditor() {
    let editor = db_manager.getActiveEditorCode();
    if (typeof editor !== 'undefined' && editor !== null) {
      if (editor == codes.Editors.VHDL) {
        return this.getVhdlEditor();
      } else if (editor == codes.Editors.VERILOG) {
        return this.getVerilogEditor();
      }
    }
  }

  getVhdlEditor() {
    return VhdlEditor;
  }

  getVerilogEditor() {
    return VerilogEditor;
  }
}

var instance = new EditorFactory();
module.exports = instance
