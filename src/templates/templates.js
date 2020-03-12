// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

const Cocotb = require('./cocotb')
const Verilator = require('./verilator')
const VUnit = require('./vunit')
const VHDLTestbench = require('./vhdleditor')
const VerilogTestbench = require('./verilogeditor')
const General = require('../general/general')
const Codes = require('./codes')

class Templates {
  getTemplate(type,structure,options){
    var language = options["language"];
    var template;
    if (type == Codes.TYPES.COCOTB)
      template = this.getCocotbTemplate(structure);
    else if(type == Codes.TYPES.VERILATOR)
      template = this.getVerilatorTemplate(structure);
    else if(type == Codes.TYPES.VUNIT)
      template = this.getVUnitTemplate(structure);
    else if(type == Codes.TYPES.TESTBENCH){
      if (language == General.LANGUAGES.VHDL)
        template = this.getVHDLTestbench(structure,options);
      else if(language == General.LANGUAGES.VERILOG)
        template = this.getVerilogTestbench(structure,options);
    }
    else if(type == Codes.TYPES.COMPONENT){
      if (language == General.LANGUAGES.VHDL)
        template = this.getVHDLComponent(structure,options);
      else if(language == General.LANGUAGES.VERILOG)
        template = this.getVerilogComponent(structure,options);
    }
    return template;
  }

  getCocotbTemplate(structure) {
    var template = new Cocotb.cocotb(structure);
    return template.generate();
  }

  getVerilatorTemplate(structure) {
    var template = new Verilator.verilator(structure);
    return template.generate();
  }

  getVUnitTemplate(structure) {
    var template = new VUnit.runpy(structure);
    return template.generate();
  }

  getVHDLTestbench(structure, options) {
    return VHDLTestbench.createTestbench(structure, options);
  }

  getVerilogTestbench(structure, options) {
    return VerilogTestbench.createTestbench(structure, options);
  }

  getVHDLComponent(structure, options) {
    return VHDLTestbench.createComponent(structure, options);
  }

  getVerilogComponent(structure, options) {
    return VerilogTestbench.createComponent(structure, options);
  }

}

module.exports = {
  Codes : Codes,
  Templates: Templates
}
