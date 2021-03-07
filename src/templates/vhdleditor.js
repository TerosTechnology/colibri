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

//TODO: estandarizar ports y genrics.

const Codes = require('./codes');
const ParserLib = require('../parser/factory');
const General = require('../general/general');
const fs = require('fs');

class Vhdl_editor {
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
        header += `--  ${element}\n`;
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
    parser = await parser.getParser(General.LANGUAGES.VHDL, '');
    parser.init();
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    let vunit = false;
    if (options !== null) {
      vunit = options['type'] === Codes.TYPESTESTBENCH.VUNIT;
    }
    let space = this.indet_1;
    let str = header;
    str += "library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n";
    str += '\n';
    if (vunit === true) {
      str += this.set_Vunit_Libraries();
      str += '\n';
    }
    if (vunit === true) {
      str += this.set_Vunit_Entity(structure['entity']);
      str += '\n';
    } else {
      str += this.set_Entity(structure['entity']);
      str += '\n';
    }
    str += this.set_Architecture(structure['architecture'], structure['entity']);
    str += '\n';
    if (vunit === false) {
      str += this.set_Component(space, structure['entity']['name'], structure['generics'],
        structure['ports']);
    }
    str += '\n';
    str += this.set_Constants(space, structure['generics']);
    str += '\n';
    str += '  -- Ports\n';
    str += this.set_Signals(space, structure['ports']);
    str += '\n';
    str += 'begin\n';
    str += '\n';
    str += this.set_Instance(space, structure['entity']['name'], structure['generics'], structure['ports'], vunit);
    str += '\n';
    if (vunit === true) {
      str += this.set_Vunit_Process(space);
      str += '\n';
    }
    str += this.set_Clk_Process(space);
    str += '\n';
    str += 'end;\n';

    return str;
  }

  set_Vunit_Libraries() {
    var str = '';
    str += 'library src_lib;\n';
    str += '--\n';
    str += 'library vunit_lib;\n';
    str += 'context vunit_lib.vunit_context;\n';
    str += '-- use vunit_lib.array_pkg.all;\n';
    str += '-- use vunit_lib.lang.all;\n';
    str += '-- use vunit_lib.string_ops.all;\n';
    str += '-- use vunit_lib.dictionary.all;\n';
    str += '-- use vunit_lib.path.all;\n';
    str += '-- use vunit_lib.log_types_pkg.all;\n';
    str += '-- use vunit_lib.log_special_types_pkg.all;\n';
    str += '-- use vunit_lib.log_pkg.all;\n';
    str += '-- use vunit_lib.check_types_pkg.all;\n';
    str += '-- use vunit_lib.check_special_types_pkg.all;\n';
    str += '-- use vunit_lib.check_pkg.all;\n';
    str += '-- use vunit_lib.run_types_pkg.all;\n';
    str += '-- use vunit_lib.run_special_types_pkg.all;\n';
    str += '-- use vunit_lib.run_base_pkg.all;\n';
    str += '-- use vunit_lib.run_pkg.all;\n';
    return str;
  }

  set_Libraries(m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      str += 'use ' + m[x]['name'] + ';\n';
    }
    return str;
  }

  set_Entity(m) {
    var str = '';
    str += 'entity ' + m['name'] + '_tb is\n';
    str += 'end;\n';
    return str;
  }

  set_Vunit_Entity(m) {
    var str = '';
    str += 'entity ' + m['name'] + '_tb is\n';
    str += this.indet_1 + 'generic (runner_cfg : string);\n';
    str += 'end;\n';
    return str;
  }

  set_Architecture(m, n) {
    var str = '';
    str += 'architecture bench of ' + n['name'] + '_tb is\n';
    return str;
  }

  set_Constants(space, m) {
    var str = '';
    str += space + '-- Clock period\n';
    str += space + 'constant clk_period : time := 5 ns;\n';
    str += space + '-- Generics\n';
    for (let x = 0; x < m.length; ++x) {
      var normalized_type = m[x]['type'].replace(/\s/g, '').toLowerCase();
      if (normalized_type === "integer") {
        str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + ' := 0;\n';
      }
      else if (normalized_type === "signed" || normalized_type === "unsigned") {
        str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + " := (others => '0');\n";

      }
      else if (normalized_type === "string") {
        str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + ' := "";\n';
      }
      else if (normalized_type === "boolean") {
        str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + ' := false;\n';
      }
      else {
        str += space + 'constant ' + m[x]['name'] + ' : ' + m[x]['type'] + ';\n';
      }
    }
    return str;
  }

  set_Signals(space, m) {
    var str = '';
    for (let x = 0; x < m.length; ++x) {
      str += space + 'signal ' + m[x]['name'] + ' : ' + m[x]['type'] + ';\n';
    }
    return str;
  }

  set_Component(space, name, generics, ports) {
    var str = '';
    //Component name
    str += this.indet_1 + 'component ' + name + '\n';
    //Generics
    if (generics.length > 0) {
      str += this.indet_2 + 'generic (\n';
      for (let x = 0; x < generics.length - 1; ++x) {
        str += this.indet_3 + generics[x]['name'] + ' : ' + generics[x]['type'] + ';\n';
      }
      str += this.indet_3 + generics[generics.length - 1]['name'] + ' : ' +
        generics[generics.length - 1]['type'] + '\n';
      str += this.indet_2 + ');\n';
    }
    //Ports
    if (ports.length > 0) {
      str += this.indet_2 + '  port (\n';
      for (let x = 0; x < ports.length - 1; ++x) {
        str += this.indet_3 + ports[x]['name'] + ' : ' + ports[x]['direction'] + ' ' +
          ports[x]['type'] + ';\n';
      }
      str += this.indet_3 + ports[ports.length - 1]['name'] + ' : ' +
        ports[ports.length - 1]['direction'] + ' ' +
        ports[ports.length - 1]['type'] + '\n';
      str += this.indet_2 + ');\n';
    }
    //End component
    str += this.indet_1 + 'end component;\n';

    return str;
  }

  set_Instance(space, name, generics, ports, vunit, vhdl2008) {
    var str = '';
    //Instance name
    if (vunit !== undefined && vunit === true) {
      str += this.indet_1 + name + '_inst : entity src_lib.' + name + '\n';
    } else if (vhdl2008 !== undefined && vhdl2008 === true) {
      str += this.indet_1 + name + '_inst : entity work.' + name + '\n';
    } else {
      str += this.indet_1 + name + '_inst : ' + name + '\n';
    }
    //Generics
    if (generics.length > 0) {
      str += this.indet_2 + 'generic map (\n';
      for (let x = 0; x < generics.length - 1; ++x) {
        str += this.indet_3 + generics[x]['name'] + ' => ' + generics[x]['name'] + ',\n';
      }
      str += this.indet_3 + generics[generics.length - 1]['name'] + ' => '
        + generics[generics.length - 1]['name'] + '\n';
      str += this.indet_2 + ')\n';
    }
    //Ports
    if (ports.length > 0) {
      str += this.indet_2 + 'port map (\n';
      for (let x = 0; x < ports.length - 1; ++x) {
        str += this.indet_3 + ports[x]['name'] + ' => ' + ports[x]['name'] + ',\n';
      }
      str += this.indet_3 + ports[ports.length - 1]['name'] + ' => ' + ports[ports.length - 1]['name'] + '\n';
      str += this.indet_2 + ');\n';
    }
    return str;
  }

  set_Vunit_Process() {
    var str = '';
    str += this.indet_1 + 'main : process\n';
    str += this.indet_1 + 'begin\n';
    str += this.indet_2 + 'test_runner_setup(runner, runner_cfg);\n';
    str += this.indet_2 + 'while test_suite loop\n';
    str += this.indet_3 + 'if run("test_alive") then\n';
    str += this.indet_4 + 'info("Hello world test_alive");\n';
    str += this.indet_4 + 'wait for 100 ns;\n';
    str += this.indet_4 + 'test_runner_cleanup(runner);\n';
    str += this.indet_4 + '\n';
    str += this.indet_3 + 'elsif run("test_0") then\n';
    str += this.indet_4 + 'info("Hello world test_0");\n';
    str += this.indet_4 + 'wait for 100 ns;\n';
    str += this.indet_4 + 'test_runner_cleanup(runner);\n';
    str += this.indet_3 + 'end if;\n';
    str += this.indet_2 + 'end loop;\n';
    str += this.indet_1 + 'end process main;\n';
    return str;
  }

  set_Clk_Process(space) {
    var str = '';
    str += '-- ' + space + "clk_process : process\n";
    str += '-- ' + space + "begin\n";
    str += '-- ' + space + this.indet_0 + "clk <= '1';\n";
    str += '-- ' + space + this.indet_0 + "wait for clk_period/2;\n";
    str += '-- ' + space + this.indet_0 + "clk <= '0';\n";
    str += '-- ' + space + this.indet_0 + "wait for clk_period/2;\n";
    str += '-- ' + space + "end process clk_process;\n";
    return str;
  }
}

class Vhdl_component extends Vhdl_editor {
  async generate(src, options) {
    this.indet_0 = '';
    this.indet_1 = '';
    this.indet_2 = '';
    this.indet_3 = '';
    if (options !== undefined && options.indent_char !== undefined) {
      let base = options.indent_char;
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(0);
      this.indet_2 = base.repeat(1);
      this.indet_3 = base.repeat(2);
      this.indet_4 = base.repeat(3);
    }
    else {
      let base = '    ';
      this.indet_0 = base.repeat(0);
      this.indet_1 = base.repeat(0);
      this.indet_2 = base.repeat(1);
      this.indet_3 = base.repeat(2);
      this.indet_4 = base.repeat(3);
    }

    let parser = new ParserLib.ParserFactory;
    parser = await parser.getParser(General.LANGUAGES.VHDL, '');
    parser.init();
    let structure = await parser.get_all(src);
    if (structure === undefined) {
      return undefined;
    }
    if (options === null) { return ""; }
    var component = "";
    if (options['type'] === Codes.TYPESCOMPONENTS.COMPONENT) {
      component = this.set_Component('  ', structure['entity']['name'],
        structure['generics'], structure['ports'], false);
    } else if (options['type'] === Codes.TYPESCOMPONENTS.INSTANCE) {
      component = this.set_Instance('  ', structure['entity']['name'],
        structure['generics'], structure['ports'], false, false);
    } else if (options['type'] === Codes.TYPESCOMPONENTS.INSTANCE_VHDL2008) {
      component = this.set_Instance('  ', structure['entity']['name'],
        structure['generics'], structure['ports'], false, true);
    } else if (options['type'] === Codes.TYPESCOMPONENTS.SIGNALS) {
      component = this.set_Signals('  ', structure['ports']);
    }
    else {
      // eslint-disable-next-line no-console
      console.log("error");
    }
    return component;
  }
}



//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  Vhdl_editor: Vhdl_editor,
  Vhdl_component: Vhdl_component
};
