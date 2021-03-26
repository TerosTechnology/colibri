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

const Vsg = require('./vsg');
const Standalone_vhdl = require('./standalone_vhdl');
const Istyle = require('./istyle');
const S3SV = require('./s3sv');

// const Verible = require('./verible');
const General = require('../general/general');

class Formatter {
  constructor(formatter_name){
    if (formatter_name === undefined){
      throw new Error('Formatter name is undefined.');
    }
    else if (formatter_name === General.FORMATTERS.VSG) {
      return this.get_vsg();
    }
    else if (formatter_name === General.FORMATTERS.ISTYLE) {
      return this.get_istyle();
    }
    else if (formatter_name === General.FORMATTERS.S3SV) {
      return this.get_s3sv();
    }
    else if (formatter_name === General.FORMATTERS.VERIBLE) {
    //   return this.get_verible();
    }
    else if (formatter_name === General.FORMATTERS.STANDALONE) {
      return this.get_standalone_vhdl();
    }  
    else{
      throw new Error('Formatter name not supported.');
    }
  }

  get_istyle() {
    return new Istyle.Istyle();
  }
  get_verible() {
    return new Verible.Verilbe();
  }
  get_standalone_vhdl() {
    return new Standalone_vhdl.Standalone_vhdl();
  }
  get_vsg() {
    return new Vsg.Vsg();
  }
  get_s3sv() {
    return new S3SV.S3SV();
  }
}


// eslint-disable-next-line no-undef
module.exports = {
  Formatter : Formatter
};
