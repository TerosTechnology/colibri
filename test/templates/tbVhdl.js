// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');

let options = {
  'type' : "normal",
  'language' : Colibri.General.LANGUAGES.VHDL,
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'structure.json','utf8');
structure     = JSON.parse(structure);
var testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdl.vhd','utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getTemplate(Colibri.Templates.Codes.TYPES.TESTBENCH,structure, options);

console.log('****************************************************************');
if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') === test.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
  console.log("Testing... tbVhdl: Ok!");
}
else{
  console.log("Testing... tbVhdl: Fail!");
  throw new Error('Test error.');
}
////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit";
testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdlVunit.vhd','utf8');
templates = new Colibri.Templates.Templates();
var test = templates.getTemplate(Colibri.Templates.Codes.TYPES.TESTBENCH,structure, options)

if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === test.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
  console.log("Testing... tbVhdlVunit: Ok!");
}
else{
  console.log("Testing... tbVhdlVunit: Fail!");
  throw new Error('Test error.');
}
console.log('****************************************************************');
