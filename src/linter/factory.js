const Ghdl = require('./ghdl')
const Icarus = require('./icarus')
const Modelsim = require('./modelsim')
const Verilator = require('./verilator')
const General = require('../general/general')

class LinterFactory {
  constructor(sim){
    if (sim == General.SIMULATORS.GHDL) {
      return this.getGhdl();
    }
    else if (sim == General.SIMULATORS.ICARUS){
      return this.getIcarus();
    }
    else if (sim == General.SIMULATORS.MODELSIM){
      return this.getModelsim();
    }
    else if (sim == General.SIMULATORS.VERILATOR){
      return this.getVerilator();
    }
  }

  getGhdl() {
    return new Ghdl.Ghdl();
  }

  getIcarus() {
    return new Icarus.Icarus();
  }

  getModelsim() {
    return new Modelsim.Modelsim();
  }

  getVerilator() {
    return new Verilator.Verilator();
  }
}

module.exports = {
  LinterFactory : LinterFactory
}
