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

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Colibri = require('../../src/main');
const Formatter = Colibri.Formatter;
const General = Colibri.General;

let base_name = ["resources"];
let custom_path = [true,true];

// let linters_path = {
//   'icarus' : "/usr/bin",
//   'verilator' : "/usr/bin",
//   'xvlog' : "/opt/Xilinx/Vivado/2018.3/bin/",
//   'ghdl' : "/usr/local/bin",
//   'xvhdl' : "/opt/Xilinx/Vivado/2018.3/bin/",
//   'vsg' : ""
// };

for (let m=0; m<custom_path.length;++m){
    /**************************************************************************** */
    /**** Linters vhdl 
    /**************************************************************************** */
    // let linters_vhdl = [General.LINTERS.XVHDL,General.LINTERS.GHDL,General.LINTERS.VSG];
    let formatters_vhdl = [General.FORMATTERS.VSG];
    let base_name_resources = base_name[0];

    for (let i=0; i<formatters_vhdl.length; ++i){
      let formatter_name_vhdl = formatters_vhdl[i];
      let options_vhdl = undefined;
      // if (custom_path[m] === true){
      //   options_vhdl = {'custom_path' : linters_path[linter_name_vhdl]};
      // }
      let formatter_vhdl = new Formatter.Formatter(formatter_name_vhdl);

      let file_vhdl = __dirname + path.sep + base_name_resources + path.sep + "vhdl" + path.sep + "test_0.vhd";
      let code_vhdl = fs.readFileSync(file_vhdl, 'utf8');
      let expected = fs.readFileSync(`${__dirname}${path.sep}${base_name_resources}${path.sep}vhdl${path.sep}test_0_formatted_${formatter_name_vhdl}.vhd`, 'utf8');

      formatter_vhdl.format_from_code(code_vhdl,options_vhdl).then(function(formatted_code) {
        if (expected !== formatted_code){
          throw new Error(`Error ${formatter_name_vhdl}`);
        }
        console.log(`------> Test ${formatter_name_vhdl} = OK!`);
      }, function(err) {
        throw new Error(err);
      });
    } 
}


