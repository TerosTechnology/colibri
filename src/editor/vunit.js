class runpy {
  constructor(estructure){
    this.str     = estructure;
    this.str_out = "";
    this.path = require('path')
  }
  generate(){
    this.header();
    this.pythonLibraries()
    this.setLang()
    this.separator()
    this.checkSimulator()
    this.separator()
    this.vunitInstance()
    this.separator()
    this.addSrc()
    this.addTb()
    this.separator()
    this.run()
    return this.str_out;
  }

  header(){
    this.str_out = "# -*- coding: utf-8 -*-\n"
  }
  pythonLibraries(){
    this.str_out += "from os.path import join , dirname, abspath\nimport subprocess\nfrom vunit.ghdl_interface import GHDLInterface\nfrom vunit.simulator_factory import SIMULATOR_FACTORY\n"
  }
  setLang(){
    if (this.str.lang=="vhdl") {
      this.str_out += "from vunit   import VUnit, VUnitCLI\n"
    }
    else if(this.str.lang=="verilog"){
      this.str_out += "from vunit.verilog   import VUnit, VUnitCLI\n"
    }
  }
  separator(){
    this.str_out += "\n##############################################################################\n"
  }
  checkSimulator(){
    this.str_out += "\n#Check simulator.\n"
    this.str_out += 'print ("=============================================")\n'
    this.str_out += 'simulator_class = SIMULATOR_FACTORY.select_simulator()\nsimname = simulator_class.name\nprint simname\n'
    this.str_out += 'if (simname == "modelsim"):\n  f= open("modelsim.do","w+")\n  f.write("add wave * \\nlog -r /*\\nvcd file\\nvcd add -r /*\\n")\n  f.close()\n'
    this.str_out += 'print ("=============================================")\n'
  }
  vunitInstance(){
    this.str_out += '\n#VUnit instance.\n'
    this.str_out += 'ui = VUnit.from_argv()\n'
  }
  addSrc(){
    this.str_out += '\n#Add module sources.\n'
    this.str_out += this.str.config["name"] + '_src_lib = ui.add_library("src_lib")\n'
    for(var x = 0; x < this.str.src.length;x++){
      let file = this.path.relative(this.str.config["outputPath"],this.str.src[x])
      file.replace("\\","\\\\")
      this.str_out += this.str.config["name"] + '_src_lib.add_source_files("' + file + '")\n'
    }
  }
  addTb(){
    this.str_out += '\n#Add tb sources.\n'
    this.str_out += this.str.config["name"] + '_tb_lib = ui.add_library("tb_lib")\n'
    for(var x = 0; x < this.str.tb.length;x++){
      let file = this.path.relative(this.str.config["outputPath"],this.str.tb[x])
      file.replace("\\","\\\\")
      this.str_out += this.str.config["name"] + '_tb_lib.add_source_files("' + file + '")\n'
    }
  }
  run(){
    this.str_out += '\n#Run tests.\n'
    this.str_out += 'try:\n'
    this.str_out += '  ui.main()\n'
    this.str_out += 'except SystemExit as exc:\n'
    this.str_out += '  all_ok = exc.code == 0\n'
  }
}


module.exports = {
  runpy : runpy
}
