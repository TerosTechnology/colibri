const Ghdl = require('./ghdl')
const Icarus = require('./icarus')
const Modelsim = require('./modelsim')
const Verilator = require('./verilator')
const General = require('../general/general')

class LinterFactory {
  constructor(sim,path){
    if (sim == General.SIMULATORS.GHDL) {
      return this.getGhdl(path);
    }
    else if (sim == General.SIMULATORS.ICARUS){
      return this.getIcarus(path);
    }
    else if (sim == General.SIMULATORS.MODELSIM){
      return this.getModelsim(path);
    }
    else if (sim == General.SIMULATORS.VERILATOR){
      return this.getVerilator(path);
    }
    else
      return null;
  }

  getGhdl(path) {
    return new Ghdl.Ghdl(path);
  }

  getIcarus(path) {
    return new Icarus.Icarus(path);
  }

  getModelsim(path) {
    return new Modelsim.Modelsim(path);
  }

  getVerilator(path) {
    return new Verilator.Verilator(path);
  }
}

module.exports = {
  LinterFactory : LinterFactory
}
