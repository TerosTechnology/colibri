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
const Codes = require('../../src/templates/codes')

let path_example = __dirname + path.sep + 'examples'+path.sep+'verilog'+path.sep
let structure_v = fs.readFileSync(path_example+'example_0.v','utf8');

let options = Colibri.General.LANGUAGES.VERILOG;
let veritest = new Colibri.Templates.Templates_factory();
let verilator_expected = fs.readFileSync(path_example+'veritest.cpp','utf8');
let veritest_gen = veritest.get_template(Codes.TYPES.VERILATOR,options);
veritest_gen.generate(structure_v).then(verilator_template => {
  console.log('****************************************************************');
  if(verilator_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') 
    === verilator_template.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: verilator --> ok!".green);
  }
  else{
    console.log("---> Tested: verilator --> fail!".red);
    throw new Error('Test error.');
  }
});
