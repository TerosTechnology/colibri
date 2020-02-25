const Vhdl = require('./vhdl/beautifuler')
// const Verilog = require('./icarus')

class BeautifulerFactory {
  getBeautifuler(lang){
    if (lang == "vhdl")
      return this.getVhdlBeautifuler();
    else if (lang == "verilog")
      return this.getVerilogBeautifuler();
    else
      return null;
  }

  getVhdlBeautifuler() {
    return new Vhdl.Beautifuler();
  }

  getVerilogBeautifuler() {
    return new Verilog.Beautifuler();
  }
}

module.exports = {
  BeautifulerFactory : BeautifulerFactory
}
