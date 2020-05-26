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
  'type' : "normal",
  'language' : Colibri.General.LANGUAGES.VHDL,
  'parameters' : [
    {'parameter' : "X"},
    {'parameter' : "Y"}
  ]
}
////////////////////////////////////////////////////////////////////////////////
var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'example.vhd','utf8');
var testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdl.vhd','utf8');
templates = new Colibri.Templates.Templates();
templates.getTemplate(Colibri.Templates.Codes.TYPES.TESTBENCH,structure, options).then(test_vhd => {
  console.log('****************************************************************');
  if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'') === test_vhd.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g,'')){
    console.log("Testing... tbVhdl: Ok!".green);
  }
  else{
    console.log("Expected -->".yellow);
    console.log(testExpected);
    console.log("Real     -->".yellow);
    console.log(test_vhd);
    console.log("Testing... tbVhdl: Fail!".red);
    throw new Error('Test error.');
  }
});

////////////////////////////////////////////////////////////////////////////////
options['type'] = "vunit";
testExpected = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'tbVhdlVunit.vhd','utf8');
templates = new Colibri.Templates.Templates();
templates.getTemplate(Colibri.Templates.Codes.TYPES.TESTBENCH,structure, options).then(test_vhdl_vunit =>{
  if(testExpected.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '') === test_vhdl_vunit.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '')){
    console.log("Testing... tbVhdlVunit: Ok!".green);
  }
  else{
    console.log("Expected -->".yellow);
    console.log(testExpected);
    console.log("Real     -->".yellow);
    console.log(test_vhdl_vunit);
    console.log("Testing... tbVhdlVunit: Fail!".red);
    throw new Error('Test error.');
  }
  console.log('****************************************************************');
} )


