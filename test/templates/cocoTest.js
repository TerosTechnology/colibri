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

const path = require('path');
const fs = require('fs');
const Colibri = require('../../src/main');

var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'structure.json','utf8');
var structure_vhdl     = JSON.parse(structure);
var structure = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'structure.json','utf8');
var structure_v     = JSON.parse(structure);

var cocotbpyVhdl = new Colibri.Templates.Templates();
var cocotbpyV = new Colibri.Templates.Templates();

fs.writeFile("cocotbVhdl.py", cocotbpyVhdl.getCocotbTemplate(structure_vhdl), function(err) {
    if(err) {
        return console.log(err);
        throw new Error('Test error.');
    }
    else
      console.log("---> Tested: cocotb vhdl");
});
fs.writeFile("cocotbV.py", cocotbpyV.getCocotbTemplate(structure_v), function(err) {
    if(err) {
        return console.log(err);
        throw new Error('Test error.');
    }
    else
      console.log("---> Tested: cocotb verilog");
});
