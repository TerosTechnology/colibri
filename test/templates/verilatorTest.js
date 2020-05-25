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

let path_example = 'examples'+path.sep+'verilog'+path.sep
var structure_v = fs.readFileSync(path_example+'uart.v','utf8');

var veritest = new Colibri.Templates.Templates();

let options = {
  "type": "verilator",
  "language": "verilog"
};
let verilator_expected = fs.readFileSync(path_example+'veritest.cpp','utf8');
veritest.getTemplate(Codes.TYPES.VERILATOR,structure_v,options).then(verilator_template => {
  console.log('****************************************************************');
  if(verilator_expected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') === verilator_template.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("---> Tested: verilator --> ok!".green);
  }
  else{
    console.log("---> Tested: verilator --> fail!".red);
    throw new Error('Test error.');
  }
});
