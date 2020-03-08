// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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

const ln = require('../src/documenter/documenter');
const fs = require('fs');

var generics = [
  {'name' : "generic_0",
   'type' : 'integer' },
  {'name' : "generic_1",
   'type' : 'std_logic' },
  {'name' : "generic_2",
   'type' : 'integer' }
];

var ports = [
  {'name'      : "port_0",
   'direction' : 'in',
   'type'      : 'integer' },
  {'name'      : "port_1",
   'direction' : 'in',
   'type'      : 'std_logic' },
  {'name'      : "port_2",
   'direction' : 'out',
   'type'      : 'std_logic_vector(generic_0 downto 0)' }
];

var structure = fs.readFileSync('./documentation/examples/vhdl/structure.json','utf8');
structure     = JSON.parse(structure);

var D = new ln.BaseStructure(structure);
var md = D.getMdDoc('./');
D.getPdfDoc('./');
var html = D.getHtmlDoc();
var svg = D.getDiagram();

console.log(md);
