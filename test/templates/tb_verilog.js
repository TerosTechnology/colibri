/* eslint-disable no-console */
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

// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');
const Codes = require('../../src/templates/codes');

let options = {
  'type': "normal",
  'version': Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters': [{
    'parameter': "X"
  },
  {
    'parameter': "Y"
  }
  ]
};
let language = Colibri.General.LANGUAGES.VERILOG;
////////////////////////////////////////////////////////////////////////////////
for (let x = 0; x < 3; x++) {
  let structure = fs.readFileSync(__dirname + path.sep + 'examples' + path.sep + 'verilog' + path.sep + 'example_' + x + '.v', 'utf8');
  let test_Expected = fs.readFileSync(__dirname + path.sep + 'examples' + path.sep + 'verilog'
    + path.sep + 'tbVerilog2001_' + x + '.v', 'utf8');
  let templates = new Colibri.Templates.Templates_factory();
  let templates_class = templates.get_template(Codes.TYPES.TESTBENCH, language);
  templates_class.generate(structure, options).then(test => {
    console.log('****************************************************************');
    if (test_Expected.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')
      === test.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')) {
      console.log("Testing... tbVerilog 2001: Ok!".green + " --> file: ".yellow + 'example_' + x + '.v');
    } else {
      console.log("Testing... tbVerilog 2001: Fail!".red + " --> file: ".yellow + 'example_' + x + '.v');
      if (process.argv[2] === 'out') {
        fs.writeFileSync(__dirname + '/examples/'+process.argv[2]+'/test_v_tb/example_'+x+'.txt',test, 'utf8');
        console.log(test);
      }
      throw new Error('Test error.');
    }
  });
}

//////////////////////////////////////////////////////////////////////////////
let options_vunit = {
  'type': "vunit",
  'version': Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'parameters': [{
    'parameter': "X"
  },
  {
    'parameter': "Y"
  }
  ]
};
for (let x = 0; x < 3; x++) {
  let structure = fs.readFileSync(__dirname + path.sep + 'examples' + path.sep + 'verilog' + path.sep + 'example_' + x + '.v', 'utf8');
  let test_Expected_vunit = fs.readFileSync(__dirname + path.sep + 'examples' + path.sep
    + 'verilog' + path.sep + 'tbVerilogVunit2001_' + x + '.v', 'utf8');
  let templates_vunit = new Colibri.Templates.Templates_factory();
  let templates_vunit_class = templates_vunit.get_template(Codes.TYPES.TESTBENCH, language);
  templates_vunit_class.generate(structure, options_vunit).then(test_vunit => {
    if (test_Expected_vunit.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')
      === test_vunit.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')) {
      console.log("Testing... tbVerilogVunit 2001: Ok!".green + " --> file: ".yellow + 'example_' + x + '.v');
    } else {
      console.log("Testing... tbVerilogVunit 2001: Fail!".red + " --> file: ".yellow + 'example_' + x + '.v');
      if (process.argv[2] === 'out') {
        fs.writeFileSync(__dirname + '/examples/'+process.argv[2]+'/test_v_vunit_tb/example_'+x+'.txt', test_vunit, 'utf8');
        console.log(test_vunit);
      }
      throw new Error('Test error.');
    }
    console.log('****************************************************************');
  });
}

