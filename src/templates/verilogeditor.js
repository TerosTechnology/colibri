// Copyright 2021 Teros Technology
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
const ParserLib = require('../parser/factory');
const fs = require('fs');

class Verilog_editor {
  constructor() { }

  get_header(header_file_path) {
    if (header_file_path === undefined || header_file_path === '') {
      return '';
    }

    try {
      let header_f = fs.readFileSync(header_file_path, 'utf8');
      let lines = header_f.split(/\r?\n/g);
      let header = '';
      for (let i = 0; i < lines.length; i++) {
        const element = lines[i];
        header += `//  ${element}\n`;
      }
      return header + '\n';
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return '';
    }
  }

  async generate(src, options) {
    let header = '';
    if (options !== undefined) {
      header = this.get_header(options.header_file_path);
    }

    this.indet_0 = '';
    this.indet_1 = '';
    this.indet_2 = '';
    this.indet_3 = '';
    if (options !== undefined && options.indent_char !== undefined) {
      let base = options.indent_char;
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
      this.indet_4 = base.repeat(4);
    }
    else {
      let base = '    ';
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
      this.indet_4 = base.repeat(4);
    }
    let parser = new ParserLib.ParserFactory;
    parser = await parser.getParser(General.LANGUAGES.VERILOG, '');
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    let vunit = false;
    let version = General.VERILOGSTANDARS.VERILOG2001;
    if (options !== null) {
      vunit = options['type'] === Codes.TYPESTESTBENCH.VUNIT;
      version = options['version'];
    }
    let space = this.indet_1;
    let str = header;
    if (vunit === true) {
      str += this.set_vunit_libraries();
      str += '\n';
    }
    str += this.set_entity(structure['entity']);
    str += '\n';
    str += this.set_constants(space, structure['generics']);
    str += '\n';
    str += '  // Ports\n';
    str += this.set_signals_tb(space, structure['ports']);
    str += '\n';

    str += this.set_instance2001(space, structure['entity']['name'], structure['generics'], structure['ports']);
    str += '\n';
    if (vunit === true) {
      str += this.set_vunit_process(space);
      str += '\n';
    } else {
      str += this.set_main(space);
      str += '\n';
    }
    str += this.set_clk_process(space, structure['ports']);
    str += '\n';
    str += 'endmodule\n';

    return str;
  }

  set_vunit_libraries() {
    var str = '';
    str += '`include "vunit_defines.svh"\n';
    return str;
  }

  set_libraries(m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      str += `use ${m[x]['name']};\n`;
    }
    return str;
  }

  set_entity(m) {
    var str = '';
    str += `module ${m['name']}_tb;\n`;
    return str;
  }

  set_constants(space, m) {
    var str = '';
    str += `${space}// Parameters\n`;
    for (let x = 0; x < m.length; ++x) {
      str += `${space}localparam ${m[x]['type']} ${m[x]['name']} = 1;\n`;
    }
    return str;
  }

  set_signals_tb(space, m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      if (m[x]['type'] === '') {
        if (m[x]['direction'] === "input") {
          str += `${space}reg ${m[x]['name']} = 0;\n`;
        } else {
          str += `${space}wire ${m[x]['name']};\n`;
        }

      }
      else {
        const regex = /\[(.*?)\]/;
        let type = m[x]['type'].match(regex);
        if (type === null) {
          type = '';
        } else {
          type = type[0];
        }
        if (m[x]['direction'] === "input") {
          if (type === '') {
            str += `${space}reg ${type} ${m[x]['name']} = 0;\n`;
          } else {
            str += `${space}reg ${type} ${m[x]['name']};\n`;
          }
        } else {
          str += `${space}wire ${type} ${m[x]['name']};\n`;
        }

      }
    }
    return str;
  }

  set_signals(space, m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      if (m[x]['type'] === '') {
        str += `${space}reg r_${m[x]['name']};\n`;

      }
      else {
        const regex = /\[(.*?)\]/;
        let type = m[x]['type'].match(regex);
        if (type === null) {
          type = '';
        } else {
          type = type[0];
        }
        str += `${space}reg ${type} r_${m[x]['name']};\n`;
      }
    }
    return str;
  }

  set_instance(space, name, generics, ports) {
    var str = '';
    //Instance name
    str += `${space}${name}\n`;
    //Parameters
    if (generics.length > 0) {
      str += `${this.indet_1}#(\n`;
      for (let x = 0; x < generics.length - 1; ++x) {
        str += `${this.indet_2}${generics[x]['name']},\n`;
      }
      str += `${this.indet_2}${generics[generics.length - 1]['name']}\n`;
      str += `${this.indet_2})\n`;
    }
    //Ports
    if (ports.length > 0) {
      str += `${space} ${name}_dut (\n`;
      for (let x = 0; x < ports.length - 1; ++x) {
        str += `${this.indet_2}${ports[x]['name']},\n`;
      }
      str += `${this.indet_2}${ports[ports.length - 1]['name']}\n`;
      str += `${this.indet_1});\n`;
    }
    return str;
  }

  set_instance2001(space, name, generics, ports) {
    var str = '';
    //Instance name
    str += `${space}${name} \n`;
    //Parameters
    if (generics.length > 0) {
      str += `${space}#(\n`;
      for (let x = 0; x < generics.length - 1; ++x) {
        str += `${this.indet_2}.${generics[x]['name']}(${generics[x]['name']} ),\n`;
      }
      str += `${this.indet_2}.${generics[generics.length - 1]['name']} (
        ${generics[generics.length - 1]['name']} )\n`;
      str += `${this.indet_1})\n`;
    }
    //Ports
    if (ports.length > 0) {
      str += `${space}${name}_dut (\n`;
      for (let x = 0; x < ports.length - 1; ++x) {
        str += `${this.indet_2}.${ports[x]['name']} (${ports[x]['name']} ),\n`;
      }
      str += `${this.indet_2}.${ports[ports.length - 1]['name']}  ( ${ports[ports.length - 1]['name']})\n`;
      str += `${space});\n`;
    }
    return str;
  }

  set_vunit_process(space) {
    var str = '';
    str += `${space}\`TEST_SUITE begin\n`;
    str += `${this.indet_2}// It is possible to create a basic test bench without any test cases\n`;
    str += `${this.indet_2}$display("Hello world");\n`;
    str += `${space}end\n`;
    return str;
  }

  set_main(space) {
    var str = '';
    str += `${space}initial begin\n`;
    str += `${this.indet_2}begin\n`;
    str += `${this.indet_3}$finish;\n`;
    str += `${this.indet_2}end\n`;
    str += `${space}end\n`;
    return str;
  }

  set_clk_process(space, ports) {
    var str = '';
    for (let x = 0; x < ports.length; ++x) {
      let is_clk = (ports[x]["direction"] === "input") &&
        (ports[x]["name"].includes("clk") || ports[x]["name"].includes("clock"));
      if (is_clk === true) {
        str += `${space}always\n`;
        str += `${this.indet_2}#5  ${ports[x]["name"]} = ! ${ports[x]["name"]} ;\n`;
      }
    }
    return str;
  }
}

class Verilog_component extends Verilog_editor {
  async generate(src, options) {
    this.indet_0 = '';
    this.indet_1 = '';
    this.indet_2 = '';
    this.indet_3 = '';
    if (options !== undefined && options.indent_char !== undefined) {
      let base = options.indent_char;
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
      this.indet_4 = base.repeat(4);
    }
    else {
      let base = '    ';
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
      this.indet_4 = base.repeat(4);
    }
    
    let parser = new ParserLib.ParserFactory;
    parser = await parser.getParser(General.LANGUAGES.VERILOG, '');
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    if (options === null) { return ""; }
    var component = "";
    if (options['type'] === Codes.TYPESCOMPONENTS.COMPONENT) {
      component = "";
    } else if (options['type'] === Codes.TYPESCOMPONENTS.INSTANCE) {
      component = this.set_instance2001('  ', structure['entity']['name'],
        structure['generics'], structure['ports'], false);
    } else if (options['type'] === Codes.TYPESCOMPONENTS.SIGNALS) {
      component = this.set_signals('  ', structure['ports']);
    }
    return component;
  }
}


//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  Verilog_editor: Verilog_editor,
  Verilog_component: Verilog_component
};
