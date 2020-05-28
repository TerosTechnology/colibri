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
const Linter = Colibri.Linter;
const General = Colibri.General;

let base_name = ["resources space", "resources"];
let custom_path = [true,true];

let linters_path = {
  'icarus' : "/usr/bin",
  'verilator' : "/usr/bin",
  'xvlog' : "/opt/Xilinx/Vivado/2018.3/bin/",
  'ghdl' : "/usr/local/bin",
  'xvhdl' : "/opt/Xilinx/Vivado/2018.3/bin/"
};

for (let m=0; m<custom_path.length;++m){
  for (let x=0; x<base_name.length;++x){
    let base_name_resources = base_name[x];
    /**************************************************************************** */
    /**** Linters verilog 
    /**************************************************************************** */
    let linters = [General.LINTERS.ICARUS, General.LINTERS.VERILATOR, 
      General.LINTERS.XVLOG];

    for (let i=0; i<linters.length; ++i){
      let linter_name = linters[i];
      let options = undefined;
      if (custom_path[m] === true){
        options = {'custom_path' : linters_path[linter_name]};
      }
      let linter = new Linter.Linter(linter_name);

      let file = __dirname + path.sep + base_name_resources + path.sep + "verilog" + path.sep + "test_0.v";
      let errors_expected_json = fs.readFileSync(__dirname + path.sep + base_name_resources + path.sep + "verilog" + path.sep + "expected_0.json", 'utf8');
      let errors_expected = JSON.parse(errors_expected_json);
      let errors_expected_linter = errors_expected[linter_name];
      //Normalize file
      for (let i=0; i<errors_expected_linter.length; ++i){
        errors_expected_linter[i].location.file = file;
      }
      linter.lint_from_file(file,options).then(function(errors) {
        check_errors(errors,errors_expected_linter,linter_name);
        console.log("------> Test linter [" + linter_name + "] = OK!");
      }, function(err) {
        throw new Error(err);
      });
    }

    /**************************************************************************** */
    /**** Linters vhdl 
    /**************************************************************************** */
    let linters_vhdl = [General.LINTERS.XVHDL,General.LINTERS.GHDL];

    for (let i=0; i<linters_vhdl.length; ++i){
      let linter_name_vhdl = linters_vhdl[i];
      let options_vhdl = undefined;
      if (custom_path[m] === true){
        options_vhdl = {'custom_path' : linters_path[linter_name_vhdl]};
      }
      let linter_vhdl = new Linter.Linter(linter_name_vhdl);

      let file_vhdl = __dirname + path.sep + base_name_resources + path.sep + "vhdl" + path.sep + "test_0.vhd";
      let errors_expected_json_vhdl = fs.readFileSync(__dirname + path.sep + base_name_resources + path.sep + "vhdl" + path.sep + "expected_0.json", 'utf8');
      let errors_expected_vhdl = JSON.parse(errors_expected_json_vhdl);
      let errors_expected_linter_vhdl = errors_expected_vhdl[linter_name_vhdl];
      //Normalize file
      for (let i=0; i<errors_expected_linter_vhdl.length; ++i){
        errors_expected_linter_vhdl[i].location.file = file_vhdl;
      }
      linter_vhdl.lint_from_file(file_vhdl,options_vhdl).then(function(errors) {
        check_errors(errors,errors_expected_linter_vhdl,linter_name_vhdl);
        console.log("------> Test linter [" + linter_name_vhdl + "] = OK!");
      }, function(err) {
        throw new Error(err);
      });
    }
  }
}

function check_errors(errors,expected,linter_name){
  //Check lenght
  if (expected.length === errors.length){
    for (let i=0; i<errors.length;++i){
      //Check description
      if (expected[i].description !== errors[i].description){
        throw new Error('Fail description -> ' + i + ' | In linter: ' + linter_name);
      }
      //Check error type
      if (expected[i].severity !== errors[i].severity){
        throw new Error('Fail error type -> ' + i + ' | In linter: ' + linter_name);
      }
      //Check position 0
      if (expected[i].location.position[0] !== errors[i].location.position[0]){
        console.log(expected[i].location.position);
        console.log(errors[i].location.position);
        throw new Error('Fail error position 0 -> ' + i + ' | In linter: ' + linter_name);
      }
      //Check position 1
      if (expected[i].location.position[1] !== errors[i].location.position[1]){
        console.log(expected[i].location.position);
        console.log(errors[i].location.position);
        throw new Error('Fail error position 1 -> ' + i + ' | In linter: ' + linter_name);
      }
      //Check file
      if (expected[i].location.file !== errors[i].location.file){
        throw new Error('Fail error filename -> ' + i + ' | In linter: ' + linter_name);
      }
    }
  }
  else{
    throw new Error('Error length | In linter: ' + linter_name);
  }
}


