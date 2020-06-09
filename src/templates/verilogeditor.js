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

//TODO: regular la tabulación.
//TODO: estandarizar ports y genrics.
//TODO: versión
//TODO: vunit

const General = require('../general/general');
const Codes = require('./codes');
const ParserLib = require('../parser/factory')

class VerilogEditor{
  constructor(){}

  async createTestbench(src, options) {
    let parser = new ParserLib.ParserFactory;
    parser = parser.getParser(General.LANGUAGES.VERILOG,'');
    let structure =  await parser.getAll(src);
    try {
      if (structure == 'undefined'){
        throw "Verilog parser error";
      }
    } catch(x){
        console.log(x);
    }
    var vunit = false;
    var version = General.VERILOGSTANDARS.VERILOG2001;
    if(options != null){
      vunit = options['type'] == Codes.TYPESTESTBENCH.VUNIT
      version = options['version'];
    }
    var space = '  ';
    var str = '';
    // str += setLibraries(structure['libraries']);
    // str += '\n'
    if (vunit == true) {
      str += this.setVunitLibraries();
      str += '\n'
    }
    str += this.setEntity(structure['entity']);
    str += '\n'
    str += this.setConstants(space, structure['generics']);
    str += '\n'
    str += '  // Ports\n';
    str += this.setSignals(space, structure['ports']);
    str += '\n'

    if (version == General.VERILOGSTANDARS.VERILOG2001) {
      str += this.setInstance2001(space, structure['entity']['name'], structure['generics'], structure['ports']);
    } else {
      str += this.setInstance(space, structure['entity']['name'], structure['generics'], structure['ports']);
    }
    str += '\n'
    if (vunit == true) {
      str += this.setVunitProcess(space);
      str += '\n'
    } else {
      str += this.setMain(space);
      str += '\n'
    }
    str += this.setClkProcess(space);
    str += '\n'
    str += 'endmodule\n'

    return str;
  }

  setVunitLibraries() {
    var str = '';
    str += '`include "vunit_defines.svh"\n';
    return str;
  }

  setLibraries(m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      str += 'use ' + m[x]['name'] + ';\n';
    }
    return str;
  }

  setEntity(m) {
    var str = '';
    str += 'module ' + m['name'] + '_tb;\n';
    return str;
  }

  setVunitEntity(m) {
    var str = '';
    str += 'entity ' + m['name'] + '_tb is\n';
    str += '  generic (runner_cfg : string);\n';
    str += 'end;\n';
    return str;
  }

  setConstants(space, m) {
    var str = '';
    str += space + '// Parameters\n';
    for (let x = 0; x < m.length; ++x) {
      str += space + 'localparam ' + m[x]['type'] + ' ' + m[x]['name'] + ';\n';
    }
    return str;
  }

  setSignals(space, m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      str += space + 'reg ' + m[x]['type'] + ' ' + m[x]['name'] + ';\n';
    }
    return str;
  }

  setInstance(space, name, generics, ports) {
    var str = '';
    //Instance name
    str += space + name + '\n';
    //Parameters
    if (generics.length > 0) {
      str += space + '  #(\n';
      for (let x = 0; x < generics.length - 1; ++x) {
        str += space + '    ' + generics[x]['name'] + ',\n';
      }
      str += space + '    ' + generics[generics.length - 1]['name'] + '\n';
      str += space + '  )\n'
    }
    //Ports
    if (ports.length > 0) {
      str += space + name + '_dut (\n';
      for (let x = 0; x < ports.length - 1; ++x) {
        str += space + '    ' + ports[x]['name'] + ',\n';
      }
      str += space + '    ' + ports[ports.length - 1]['name'] + '\n';
      str += space + '  );\n';
    }
    return str;
  }

  setInstance2001(space, name, generics, ports) {
    var str = '';
    //Instance name
    str += space + name + '\n';
    //Parameters
    if (generics.length > 0) {
      str += space + '  #(\n';
      for (let x = 0; x < generics.length - 1; ++x) {
        str += space + '    .' + generics[x]['name'] + '(' + generics[x]['name'] + '),\n';
      }
      str += space + '    .' + generics[generics.length - 1]['name'] + ' (' + generics[generics.length - 1]['name'] + ')\n';
      str += space + '  )\n'
    }
    //Ports
    if (ports.length > 0) {
      str += space + name + '_dut (\n';
      for (let x = 0; x < ports.length - 1; ++x) {
        str += space + '    .' + ports[x]['name'] + ' (' + ports[x]['name'] + '),\n';
      }
      str += space + '    .' + ports[ports.length - 1]['name'] + ' (' + ports[ports.length - 1]['name'] + ')\n';
      str += space + '  );\n';
    }
    return str;
  }

  setVunitProcess(space) {
    var str = '';
    str += space + '`TEST_SUITE begin\n';
    str += space + '  // It is possible to create a basic test bench without any test cases\n';
    str += space + '  $display("Hello world");\n';
    str += space + 'end\n';
    return str;
  }

  setMain(space) {
    var str = '';
    str += space + "initial begin\n";
    str += space + "begin\n";
    str += space + "  $finish;\n";
    str += space + "end\n";
    return str;
  }

  setClkProcess(space) {
    var str = '';
    str += '// ' + space + "always\n";
    str += '// ' + space + "  #5  clk =  ! clk;\n";
    return str;
  }

  async createComponent(src, options) {
    let parser = new ParserLib.ParserFactory;
    parser = parser.getParser(General.LANGUAGES.VERILOG,'');
    let structure =  await parser.getAll(src);
    try {
      if (structure == 'undefined'){
        throw "Verilog parser error";
      }
    } catch(x){
        console.log(x);
    }
    if (options == null)
      return "";
    var component = "";
    if (options['type'] == Codes.TYPESCOMPONENTS.COMPONENT) {
      component = "";
    } else if (options['type'] == Codes.TYPESCOMPONENTS.INSTANCE) {
      component = this.setInstance2001('  ', structure['entity']['name'],
        structure['generics'], structure['ports'], false);
    } else if (options['type'] == Codes.TYPESCOMPONENTS.SIGNALS) {
      component = this.setSignals('  ', structure['ports']);
    }
    return component;
  }
}

//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  VerilogEditor: VerilogEditor
}
