class verilator {
  constructor(estructure){
    this.str     = estructure;
    this.str_out = "";
    this.path = require('path')
  }
  generate(){
    this.header();
    this.loop()
    this.verilatortb()
    return this.str_out;
  }

  header(){
    this.str_out  = "#include <stdlib.h>\n"
    this.str_out += '#include "V'+this.str.entity["name"]+'.h"\n'
    this.str_out += '#include "verilated.h"\n\n'
    this.str_out += 'int main(int argc, char **argv, char** env) {\n'
    this.str_out += '  // Initialize Verilators variables\n'
    this.str_out += '  Verilated::commandArgs(argc, argv);\n\n'
    this.str_out += '  // Create an instance of our module under test\n'
    this.str_out += '  V'+this.str.entity["name"]+' *tb = new V'+this.str.entity["name"]+';\n\n'
  }

  loop(){
    this.str_out += '// Tick the clock until we are done'
    this.str_out += '//  while(!Verilated::gotFinish()) {\n'
    for (var x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] == "input") {
        this.str_out += '//    tb-> '+this.str.ports[x]["name"]+' = 1;\n'
      }
    }
    for (var x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] == "output") {
        this.str_out += '//    printf(" Output '+this.str.ports[x]["name"]+': %d \\n",tb-> '+this.str.ports[x]["name"]+');\n'
      }
    }
    this.str_out += '//    tb->eval();\n'
    this.str_out += '//  } exit(EXIT_SUCCESS);\n\n'
    for (var x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] == "input") {
        this.str_out += '    tb-> '+this.str.ports[x]["name"]+' = 1;\n'
      }
    }
    this.str_out += '    tb->eval();\n'
    for (var x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] == "output") {
        this.str_out += '    printf(" Output '+this.str.ports[x]["name"]+': %d \\n",tb-> '+this.str.ports[x]["name"]+');\n'
      }
    }
    this.str_out += '   exit(EXIT_SUCCESS);\n}'
  }

  verilatortb(){
    this.header();
    this.loop();
  }
}

module.exports = {
  verilator : verilator
}
