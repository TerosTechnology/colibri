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
const Verilator = require('./verilator');
const Xvlog = require('./xvlog');
const Modelsim = require('./modelsim');
const Xvhdl = require('./xvhdl');
const Vsg = require('./vsg');
const Verible = require('./verible');
const General = require('../general/general');

class Linter {
  constructor(linter_name, language){
    if (linter_name === undefined){
      throw new Error('Linter name is undefined.');
    }
    if (linter_name === General.LINTERS.GHDL) {
      return this.get_ghdl();
    }
    else if (linter_name === General.LINTERS.ICARUS){
      return this.get_icarus(language);
    }
    else if (linter_name === General.LINTERS.MODELSIM){
      return this.get_modelsim(language);
    }
    else if (linter_name === General.LINTERS.VERILATOR){
      return this.get_verilator(language);
    }
    else if (linter_name === General.LINTERS.XVLOG){
      return this.get_xvlog(language);
    }
    else if (linter_name === General.LINTERS.XVHDL){
      return this.get_xvhdl();
    }
    else if (linter_name === General.LINTERS.VSG){
      return this.get_vsg();
    }
    else if (linter_name === General.LINTERS.VERIBLE){
      return this.get_verible();
    }
    else{
      throw new Error('Linter name not supported.');
    }
  }

  get_ghdl() {
    return new Ghdl.Ghdl();
  }

  get_icarus(language) {
    return new Icarus.Icarus(language);
  }

  get_modelsim(language) {
    return new Modelsim.Modelsim(language);
  }

  get_verilator(language) {
    return new Verilator.Verilator(language);
  }
  get_xvlog(language) {
    return new Xvlog.Xvlog(language);
  }
  get_xvhdl() {
    return new Xvhdl.Xvhdl();
  }
  get_vsg() {
    return new Vsg.Vsg();
  }
  get_verible() {
    return new Verible.Verible();
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  Linter : Linter
};
