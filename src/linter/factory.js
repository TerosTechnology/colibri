const Ghdl = require('./ghdl')
const Icarus = require('./icarus')
const Modelsim = require('./modelsim')
const Verilator = require('./verilator')

const SIMULATORS = {
  GHDL : 'ghdl',
  ICARUS : 'icarus',
  MODELSIM : 'modelsim',
  VERILATOR : 'verilator'
};

class LinterFactory {
  constructor(sim){
    if (sim == SIMULATORS.GHDL) {
      return this.getGhdl();
    }
    else if (sim == SIMULATORS.ICARUS){
      return this.getIcarus();
    }
    else if (sim == SIMULATORS.MODELSIM){
      return this.getModelsim();
    }
    else if (sim == SIMULATORS.VERILATOR){
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
  LinterFactory : LinterFactory,
  SIMULATORS : SIMULATORS
}
