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
const fs = require('fs');

class cocotb {
  constructor(language) {
    this.str = "";
    this.language = language;
    this.str_out = "";
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

  // eslint-disable-next-line no-unused-vars
  async generate(src, options) {
    let parser = new ParserLib.ParserFactory;
    parser = await parser.getParser(this.language, '');
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    let test = "";

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
      let base = '    ';
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(1);
      this.indet_2 = base.repeat(2);
      this.indet_3 = base.repeat(3);
    }

    test += this.header(header);
    test += this.python_libraries();
    test += this.coco_test(structure);
    test += this.register_test();
    return test;
  }

  header(header) {
    let test = header;
    test += "# -*- coding: utf-8 -*-\n";
    return test;
  }
  python_libraries() {
    let test = "import cocotb\n";
    test += "from cocotb.clock import Clock\n";
    test += "from cocotb.triggers import Timer\n";
    test += "from cocotb.regression import TestFactory\n";
    return test;
  }
  coco_test(structure) {
    let test_instance = "";
    test_instance += '\n@cocotb.test()\n';
    test_instance += 'async def run_test(dut):\n';
    test_instance += this.indet_0 + 'PERIOD = 10\n';

    let ports = structure.ports;
    // Search clock
    let clock_ports_index = [];
    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      let is_clk = (port["direction"] === "in" || port["direction"] === "input")
        && (port["name"] === "clk" || port["name"].startsWith("clk")
          || port["name"] === "clk" || port["name"].startsWith("aclk"));

      if (is_clk === true) {
        clock_ports_index.push(i);
        //Clock instance
        test_instance += this.indet_0 + `cocotb.fork(Clock(dut.${port['name']}, PERIOD, 'ns').start(start_high=False))\n`;
      }
    }
    test_instance += '\n';
    //Ports instance to 0
    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      if (clock_ports_index.includes(i) === false) {
        test_instance += this.indet_0 + `dut.${port['name']} = 0\n`;
      }
    }
    test_instance += '\n';
    test_instance += this.indet_0 + `await Timer(20*PERIOD, units='ns')\n\n`;
    //Ports instance to 1
    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      if (clock_ports_index.includes(i) === false) {
        test_instance += `    dut.${port['name']} = 1\n`;
      }
    }
    test_instance += '\n';
    test_instance += this.indet_0 + `await Timer(20*PERIOD, units='ns')\n`;

    return test_instance;
  }
  register_test() {
    let test_instance = "";
    test_instance += `
# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()
    `;
    return test_instance;
  }

}

module.exports = {
  cocotb: cocotb
};
