const Cocotb = require('./cocotb')
const Verilator = require('./verilator')
const VUnit = require('./vunit')
const VHDLTestbench = require('./vhdleditor')
const VerilogTestbench = require('./verilogeditor')

class Templates {
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
  Templates: Templates
}
