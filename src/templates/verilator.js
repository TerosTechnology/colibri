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

const ParserLib = require('../parser/factory');
const General = require('../general/general');
const fs = require('fs');

class verilator {
  constructor() {
    this.str = "";
    this.str_out = "";
    this.language = General.LANGUAGES.VERILOG;
    this.path = require('path');
  }

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
        header += `#  ${element}\n`;
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
    }
    else {
      let base = '  ';
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
    }

    let parser = new ParserLib.ParserFactory;
    parser = await parser.getParser(this.language, '');
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    this.str = structure;
    this.header(header);
    this.loop();
    this.verilatortb();
    return this.str_out;
  }

  header(header) {
    if (header === undefined) {
      header = '';
    }
    this.str_out = header;
    this.str_out += "#include <stdlib.h>\n";
    this.str_out += '#include "V' + this.str.entity["name"] + '.h"\n';
    this.str_out += '#include "verilated.h"\n\n';
    this.str_out += 'int main(int argc, char **argv, char** env) {\n';
    this.str_out += this.indet_0 + '// Initialize Verilators variables\n';
    this.str_out += this.indet_0 + 'Verilated::commandArgs(argc, argv);\n\n';
    this.str_out += this.indet_0 + '// Create an instance of our module under test\n';
    this.str_out += this.indet_0 + 'V' + this.str.entity["name"] + ' *tb = new V' + this.str.entity["name"] + ';\n\n';
  }

  loop() {
    this.str_out += '// Tick the clock until we are done';
    this.str_out += '//  while(!Verilated::gotFinish()) {\n';
    for (var x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] === "input") {
        this.str_out += '//    tb-> ' + this.str.ports[x]["name"] + ' = 1;\n';
      }
    }
    for (let x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] === "output") {
        this.str_out += '//    printf(" Output ' + this.str.ports[x]["name"] + ': %d \\n",tb-> '
          + this.str.ports[x]["name"] + ');\n';
      }
    }
    this.str_out += '//    tb->eval();\n';
    this.str_out += '//  } exit(EXIT_SUCCESS);\n\n';
    for (let x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] === "input") {
        this.str_out += this.indet_1 + 'tb-> ' + this.str.ports[x]["name"] + ' = 1;\n';
      }
    }
    this.str_out += '    tb->eval();\n';
    for (let x = 0; x < this.str.ports.length; x++) {
      if (this.str.ports[x]["direction"] === "output") {
        this.str_out += this.indet_1 + 'printf(" Output ' + this.str.ports[x]["name"] + ': %d \\n",tb-> '
          + this.str.ports[x]["name"] + ');\n';
      }
    }
    this.str_out += this.indet_1 + 'exit(EXIT_SUCCESS);\n}';
  }

  verilatortb() {
    this.header();
    this.loop();
  }
}

module.exports = {
  verilator: verilator
};
