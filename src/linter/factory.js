const codes = require('../db/codes')
const db_manager = require('../db/db_manager')

const Ghdl = require('./ghdl')
const Icarus = require('./icarus')
const Modelsim = require('./modelsim')
const Verilator = require('./verilator')

class LinterFactory {
  getConfiguredLinter() {
    let linter = db_manager.getActiveLinterCode();
    if (typeof linter !== 'undefined' && linter !== null) {
      if (linter == codes.Linters.GHDL) {
        return this.getGhdl();
      } else if (linter == codes.Linters.ICARUS) {
        return this.getIcarus();
      } else if (linter == codes.Linters.MODELSIM) {
        return this.getModelsim();
      } else if (linter == codes.Linters.VERILATOR) {
        return this.getVerilator();
      }
    }
  }

  getGhdl() {
    return new Ghdl();
  }

  getIcarus() {
    return new Icarus();
  }

  getModelsim() {
    return new Modelsim();
  }

  getVerilator() {
    return new Verilator();
  }

}

var instance = new LinterFactory();
module.exports = instance
