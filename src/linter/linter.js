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

const Ghdl = require('./ghdl');
const Icarus = require('./icarus');
// const Modelsim = require('./modelsim');
const Verilator = require('./verilator');
const Xvlog = require('./xvlog');
const Xvhdl = require('./xvhdl');
const General = require('../general/general');

class Linter {
  constructor(linter_name){
    if (linter_name === undefined){
      throw new Error('Linter name is undefined.');
    }
    if (linter_name === General.LINTERS.GHDL) {
      return this.get_ghdl();
    }
    else if (linter_name === General.LINTERS.ICARUS){
      return this.get_icarus();
    }
    else if (linter_name === General.LINTERS.MODELSIM){
      // return this.get_modelsim();
    }
    else if (linter_name === General.LINTERS.VERILATOR){
      return this.get_verilator();
    }
    else if (linter_name === General.LINTERS.XVLOG){
      return this.get_xvlog();
    }
    else if (linter_name === General.LINTERS.XVHDL){
      return this.get_xvhdl();
    }
    else{
      throw new Error('Linter name not supported.');
    }
  }

  get_ghdl() {
    return new Ghdl.Ghdl();
  }

  get_icarus() {
    return new Icarus.Icarus();
  }

  // get_modelsim() {
  //   return new Modelsim.Modelsim();
  // }

  get_verilator() {
    return new Verilator.Verilator();
  }
  get_xvlog() {
    return new Xvlog.Xvlog();
  }
  get_xvhdl() {
    return new Xvhdl.Xvhdl();
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  Linter : Linter
};
