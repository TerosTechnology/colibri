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

const ln = require('../src/documenter/documenter');
const fs = require('fs');
const path = require('path');

let build_folfer = 'build_diagram';
let build_folfer_path = __dirname + path.sep + build_folfer;
if ((fs.accessSync(build_folfer_path))!==undefined) {
    fs.mkdirSync(__dirname + path.sep + build_folfer);
}

for (let x=0;x<10;++x){
    let code = fs.readFileSync(__dirname + path.sep + './examples/vhdl_diagram/example_'+x+'.vhd','utf8');
    let D = new ln.Documenter(code,"vhdl","!");
    D.save_markdown(__dirname + path.sep + build_folfer + path.sep + x + '_md.md');
    D.save_html(__dirname + path.sep + build_folfer + path.sep + x +'_html.html');
    D.save_svg(__dirname + path.sep + build_folfer + path.sep + x +'_svg.svg');
// console.log(md)
// console.log(html)
}


