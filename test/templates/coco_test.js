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
const path = require('path');
const fs = require('fs');
const Colibri = require('../../src/main');
const Codes = require('../../src/templates/codes');

let path_example_vhdl = __dirname + path.sep + 'examples'+path.sep+'vhdl'+path.sep;
let path_example_verilog = __dirname + path.sep + 'examples'+path.sep+'verilog'+path.sep;
var structure_vhdl = fs.readFileSync(path_example_vhdl+'example_0.vhd','utf8');
var structure_v = fs.readFileSync(path_example_verilog+'example_0.v','utf8');

let options = Colibri.General.LANGUAGES.VHDL;
var cocotbpyVhdl = new Colibri.Templates.Templates_factory();
let cocotb_vhdl_expected = fs.readFileSync(path_example_vhdl+'cocotbVhdl.py', 'utf8');
var template = cocotbpyVhdl.get_template(Codes.TYPES.COCOTB,options);
template.generate(structure_vhdl).then(cocotb_vhdl => {
  console.log('****************************************************************');
  if(cocotb_vhdl_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') 
      === cocotb_vhdl.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: cocotb vhdl --> ok!".green);
  }
  else{
    console.log("---> Tested: cocotb vhdl --> fail!".red);
    if (process.argv[2] === 'out') {
      fs.writeFileSync("/home/ismael/Desktop/test.txt", cocotb_vhdl, 'utf8');
      console.log(cocotb_vhdl);
    }
    throw new Error('Test error.');
  }
});

let options_verilog = Colibri.General.LANGUAGES.VERILOG;
var cocotbpyV = new Colibri.Templates.Templates_factory();
let cocotb_verilog_expected = fs.readFileSync(path_example_verilog+'cocotbV.py', 'utf8');
var templateV = cocotbpyV.get_template(Codes.TYPES.COCOTB,options_verilog);
templateV.generate(structure_v).then(cocotb_verilog => {
  console.log('****************************************************************');
  if(cocotb_verilog_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') 
      === cocotb_verilog.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: cocotb verilog --> ok!".green);
  }
  else{
    console.log("---> Tested: cocotb verilog --> fail!".red);
    if (process.argv[2] === 'out') {
      fs.writeFileSync("/home/ismael/Desktop/test.txt", cocotb_verilog, 'utf8');
      console.log(cocotb_verilog);
    }
    throw new Error('Test error.');
  }
});

