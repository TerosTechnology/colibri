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

var structure = fs.readFileSync('examples'+path.sep+'vhdl'+path.sep+'runpyConf.json','utf8');
structure     = JSON.parse(structure);

var runpy = new Colibri.Templates.Templates();

fs.writeFile("run.py", runpy.getVUnitTemplate(structure), function(err) {
    if(err) {
      throw new Error('Test error.');
    }
    else
      console.log("---> Tested: runpy generator");

//var file = fs.readFileSync('run.py','utf8');
//var fileGen = fs.readFileSync('runGen.py','utf8');
//if(file.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '').replace("\\","\\\\") != fileGen.replace(/\n/g,'').replace(/ /g,'').replace(/\r/g, '').replace("\\","\\\\")){
//    throw new Error('Template error.');
//}
//else
//  console.log("---> Tested: runpy template");

});
