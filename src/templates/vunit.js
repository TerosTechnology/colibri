// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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
    this.checkCov()
    this.separator()
    this.vunitInstance()
    this.separator()
    this.addSrc()
    this.addTb()
    this.separator()
    this.flags()
    this.run()
    this.coverageOut()
    return this.str_out;
  }

  header(){
    this.str_out = "# -*- coding: utf-8 -*-\n"
  }
  pythonLibraries(){
    this.str_out += "from os.path import join , dirname, abspath\nimport subprocess\nfrom vunit.sim_if.ghdl import GHDLInterface\nfrom vunit.sim_if.factory import SIMULATOR_FACTORY\n"
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
    this.str_out += 'simulator_class = SIMULATOR_FACTORY.select_simulator()\nsimname = simulator_class.name\nprint (simname)\n'
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
    this.str_out += '    ui.main()\n'
    this.str_out += 'except SystemExit as exc:\n'
    this.str_out += '    all_ok = exc.code == 0\n'
  }
  flags(){
    let synopsys_var = ' '
    let psl_var      = ' '
    this.str_out += '\n#Simulators flags.\n'
    this.str_out += 'if(code_coverage==True):\n'
    this.str_out += '    ' + this.str.config["name"] + '_src_lib.add_compile_option   ("ghdl.flags"     , [ '+synopsys_var+'"-fprofile-arcs","-ftest-coverage"'+ psl_var+'])\n'
    this.str_out += '    ' + this.str.config["name"] + '_tb_lib.add_compile_option    ("ghdl.flags"     , [ '+synopsys_var+'"-fprofile-arcs","-ftest-coverage"'+ psl_var+'])\n'
    this.str_out += '    ui.set_sim_option("ghdl.elab_flags"      , ['+synopsys_var+'"-Wl,-lgcov"'+psl_var+'])\n'
  }
  checkCov(){
    this.str_out += '\n#Check GHDL backend.\n'
    this.str_out += 'code_coverage=False\ntry:\n    if( GHDLInterface.determine_backend("")=="gcc" or  GHDLInterface.determine_backend("")=="GCC"):\n      code_coverage=True\n    else:\n      code_coverage=False\nexcept:\n    print("")\n'
  }
  coverageOut(){
    this.str_out += '\n#Code coverage.\n'
    this.str_out += 'if all_ok:\n'
    this.str_out += '    if(code_coverage==True):\n'
    for(var x=0;x<this.str.src.length;x++){
      this.str_out +=  '        subprocess.call(["lcov", "--capture", "--directory", "' + this.path.basename(this.str.src[x]).split(".")[0] + '.gcda", "--output-file",  "code_' + x.toString()+ '.info" ])\n'
    }
    this.str_out += '        subprocess.call(["genhtml"'
    for(var x=0;x<this.str.src.length;x++){
      this.str_out +=  ',"code_' + x.toString()+ '.info"'
    }
    this.str_out +=  ',"--output-directory", "'+this.str.config["codeCovPath"]+'"])\n'
    this.str_out +=  '    else:\n'
    this.str_out +=  '        exit(0)\n'
    this.str_out +=  'else:\n'
    this.str_out +=  '    exit(1)\n'
  }
}


module.exports = {
  runpy : runpy
}
