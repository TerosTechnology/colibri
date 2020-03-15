// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

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
