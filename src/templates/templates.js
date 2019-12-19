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
