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

var structure = fs.readFileSync('examples'+path.sep+'verilog'+path.sep+'structure.json','utf8');
structure_v     = JSON.parse(structure);

var veritest = new Colibri.Templates.Templates();

fs.writeFile("veritest.cpp", veritest.getVerilatorTemplate(structure_v), function(err) {
    if(err) {
      throw new Error('Test error.');
    }
    else
      console.log("---> Tested: verilator");
});
