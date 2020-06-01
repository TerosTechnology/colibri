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

const Cocotb = require('./cocotb')
const Verilator = require('./verilator')
const VUnit = require('./vunit')
const VHDLTestbench = require('./vhdleditor')
const VerilogTestbench = require('./verilogeditor')
const General = require('../general/general')
const Codes = require('./codes')
const ParserLib = require('../parser/factory')

class TemplatesFactory {
  constructor(){
    this.type
    this.language
   }
  
  getTemplate(type,lang){
    this.language = lang["language"];
    this.type = type
    }

  async generate(options,str=""){
    let template;
    if(this.type == Codes.TYPES.VUNIT){
      template = this.get_vunit_template(options);
    }
    else{
      let parser = new ParserLib.ParserFactory;
      parser = parser.getParser(this.language,'');
      let structure =  await parser.getAll(str);     
      if (this.type == Codes.TYPES.COCOTB)
        template = this.get_cocotb_template(structure);
      else if(this.type == Codes.TYPES.VERILATOR)
        template = this.get_verilator_template(structure);      
      else if(this.type == Codes.TYPES.TESTBENCH){
        if (this.language == General.LANGUAGES.VHDL)
          template = this.get_vhdl_testbench(structure,options);
        else if(this.language == General.LANGUAGES.VERILOG)
          template = this.get_verilog_testbench(structure,options);
      }
      else if(this.type == Codes.TYPES.COMPONENT){
        if (this.language == General.LANGUAGES.VHDL)
          template = this.get_vhdl_component(structure,options);
        else if(this.language == General.LANGUAGES.VERILOG)
          template = this.get_verilog_component(structure,options);
      }
    }
    return template;
  }

  get_cocotb_template(structure) {
    let template = new Cocotb.cocotb(structure);
    return template.generate();
  }

  get_verilator_template(structure) {
    let template = new Verilator.verilator(structure);
    return template.generate();
  }

  get_vunit_template(structure) {
    let template = new VUnit.runpy(structure);
    return template.generate();
  }

  get_vhdl_testbench(structure, options) {
    return VHDLTestbench.createTestbench(structure, options);
  }

  get_verilog_testbench(structure, options) {
    return VerilogTestbench.createTestbench(structure, options);
  }

  get_vhdl_component(structure, options) {
    return VHDLTestbench.createComponent(structure, options);
  }

  get_verilog_component(structure, options) {
    return VerilogTestbench.createComponent(structure, options);
  }

}

module.exports = {
  Codes : Codes,
  TemplatesFactory: TemplatesFactory
}
