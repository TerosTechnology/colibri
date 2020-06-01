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

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');
const Codes = require('../../src/templates/codes')

let options = {
  'type': "normal",
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'language' : Colibri.General.LANGUAGES.VERILOG,
  'parameters': [{
      'parameter': "X"
    },
    {
      'parameter': "Y"
    }
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'uart.v', 'utf8');
var testExpected = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'tbVerilog2001.v', 'utf8');
templates = new Colibri.Templates.TemplatesFactory();
templates.getTemplate(Codes.TYPES.TESTBENCH,options)
templates.generate(options,structure).then(test => {
  console.log('****************************************************************');
if (testExpected.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '') === test.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')) {
  console.log("Testing... tbVerilog 2001: Ok!".green);
} else {
  console.log("Testing... tbVerilog 2001: Fail!".red);
  throw new Error('Test error.');
}
});

//////////////////////////////////////////////////////////////////////////////
let options_vunit = {
  'type': "vunit",
  'version' : Colibri.General.VERILOGSTANDARS.VERILOG2001,
  'language' : Colibri.General.LANGUAGES.VERILOG,
  'parameters': [{
      'parameter': "X"
    },
    {
      'parameter': "Y"
    }
  ]
}

testExpected_vunit = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'tbVerilogVunit2001.v', 'utf8');
templates_vunit = new Colibri.Templates.TemplatesFactory();
templates_vunit.getTemplate(Codes.TYPES.TESTBENCH,options_vunit)
templates_vunit.generate(options_vunit,structure).then(test_vunit => {
console.log('****************************************************************');
if (testExpected_vunit.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '') === test_vunit.replace(/\n/g, '').replace(/ /g, '').replace(/\r/g, '')) {
  console.log("Testing... tbVerilogVunit 2001: Ok!".green);
} else {
  console.log("Testing... tbVerilogVunit 2001: Fail!".red);
  throw new Error('Test error.');
}
});


