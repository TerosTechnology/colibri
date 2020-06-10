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
const Vhdl_editor = require('./vhdleditor')
const Verilog_editor = require('./verilogeditor')
const General = require('../general/general')
const Codes = require('./codes')

class Templates_factory {
  constructor(){ }
  
  get_template(type,lang){
    let language = lang["language"];
    // let type = type
    let template;
      // let parser = new ParserLib.ParserFactory;
      // parser = parser.getParser(this.language,'');
      // let structure =  await parser.getAll(str);  
      if(type == Codes.TYPES.VUNIT)
        template = this.get_vunit_template();   
      else if (type == Codes.TYPES.COCOTB){
        template = this.get_cocotb_template(language);
      }
      else if(type == Codes.TYPES.VERILATOR)
        template = this.get_verilator_template();      
      else if(type == Codes.TYPES.TESTBENCH){
        if (language == General.LANGUAGES.VHDL)
          template = this.get_vhdl_testbench();
        else if(language == General.LANGUAGES.VERILOG)
          template = this.get_verilog_testbench();
      }
      else if(type == Codes.TYPES.COMPONENT){
        if (language == General.LANGUAGES.VHDL)
          template = this.get_vhdl_component();
        else if(language == General.LANGUAGES.VERILOG)
          template = this.get_verilog_component();
      }
    return template;
  }

  get_cocotb_template(language) {
    let template = new Cocotb.cocotb(language);
    return template;
  }

  get_verilator_template() {
    let template = new Verilator.verilator();
    return template;
  }

  get_vunit_template() {
    let template = new VUnit.runpy();
    return template;
  }

  get_vhdl_testbench() {
    return new Vhdl_editor.Vhdl_editor();
  }

  get_verilog_testbench() {
    return new Verilog_editor.Verilog_editor();
  }

  get_vhdl_component() {
    return new Vhdl_editor.Vhdl_editor();
  }

  get_verilog_component() {
    return new Verilog_editor.Verilog_editor();
  }

}

module.exports = {
  Codes : Codes,
  Templates_factory: Templates_factory
}
