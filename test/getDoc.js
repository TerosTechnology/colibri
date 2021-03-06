// Copyright 2020-2021 Teros Technology
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

let configuration = {
  'fsm': true,
  'signals': 'all',
  'constants': 'all',
  'process': 'all',
  'symbol_vhdl': '!',
  'symbol_verilog': '!',
  'extra_top_space': true
};

if (process.argv[2] === 'vhdl') {
    let build_folfer = 'build_diagram';
    create_folder(build_folfer);
    for (let x=0;x<17;++x){
        let code = fs.readFileSync(__dirname + path.sep + './examples/vhdl_diagram/example_'+x+'.vhd','utf8');
        let D = new ln.Documenter(configuration);
        D.save_markdown(code, "vhdl",configuration,__dirname + path.sep + build_folfer + path.sep + x + '_md.md');
        // D.save_html(__dirname + path.sep + build_folfer + path.sep + x +'_html.html');
        // D.save_svg(__dirname + path.sep + build_folfer + path.sep + x +'_svg.svg');
        // D.save_pdf(__dirname + path.sep + build_folfer + path.sep + x +'_pdf.pdf');
    }
}

if (process.argv[2] === 'verilog') {
    let build_folfer_v = 'build_diagram_v';
    create_folder(build_folfer_v);
    for (let x = 0; x < 14; ++x) {
        let code = fs.readFileSync(__dirname + path.sep + './examples/verilog_diagram/example_' + x + '.v', 'utf8');
        let D = new ln.Documenter(configuration);
        D.save_markdown(code, "verilog", configuration, __dirname + path.sep + build_folfer_v + path.sep + x + '_md.md');
        // D.save_html(__dirname + path.sep + build_folfer_v + path.sep + x + '_html.html');
        // D.save_svg(__dirname + path.sep + build_folfer_v + path.sep + x + '_svg.svg');
        // D.save_pdf(__dirname + path.sep + build_folfer_v + path.sep + x + '_pdf.pdf');
    }
}

if (process.argv[2] === 'sv') {
    let build_folfer_sv = 'build_diagram_sv';
    create_folder(build_folfer_sv);
    for (let x=0;x<4;++x){
        let code = fs.readFileSync(__dirname + path.sep + './examples/verilog_diagram/example_'+x+'.sv','utf8');
        let D = new ln.Documenter(configuration);
        D.save_markdown(code, "verilog", configuration, __dirname + path.sep + build_folfer_sv + path.sep + x + '_md.md');
        // D.save_html(__dirname + path.sep + build_folfer_sv + path.sep + x +'_html.html');
        // D.save_svg(__dirname + path.sep + build_folfer_sv + path.sep + x +'_svg.svg');
        // D.save_pdf(__dirname + path.sep + build_folfer_sv + path.sep + x +'_pdf.pdf');
    }
}

function create_folder(build_folfer) {
    let build_folfer_path = __dirname + path.sep + build_folfer;
    try {
        fs.accessSync(build_folfer_path);
    } catch (error) {
        fs.mkdirSync(__dirname + path.sep + build_folfer);
        console.log(`${build_folfer} created`);
    }
}


