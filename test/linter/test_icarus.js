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

/**************************************************************************** */
/**** Icarus 
/**************************************************************************** */
let simulator = General.SIMULATORS.ICARUS;
let linter = new Linter.Linter(simulator);

let file = __dirname + path.sep + "resources" + path.sep + "verilog" + path.sep + "test_0.v";
let errors_expected_json = fs.readFileSync(__dirname + path.sep + "resources" + path.sep + "verilog" + path.sep + "expected_0.json", 'utf8');
let errors_expected = JSON.parse(errors_expected_json);
let errors_expected_icarus = errors_expected.ICARUS;
//Normalize file
for (let i=0; i<errors_expected_icarus.length; ++i){
  errors_expected_icarus[i].location.file = file;
}
linter.lint_from_file(file).then(function(errors) {
  check_errors(errors,errors_expected_icarus);
}, function(err) {
  throw new Error(err);
});
/**************************************************************************** */
/**** Verilator 
/**************************************************************************** */
simulator = General.SIMULATORS.VERILATOR;
linter = new Linter.Linter(simulator);

file = __dirname + path.sep + "resources" + path.sep + "verilog" + path.sep + "test_0.v";
errors_expected_json = fs.readFileSync(__dirname + path.sep + "resources" + path.sep + "verilog" + path.sep + "expected_0.json", 'utf8');
errors_expected = JSON.parse(errors_expected_json);
let errors_expected_verilator = errors_expected.VERILATOR;
//Normalize file
for (let i=0; i<errors_expected_verilator.length; ++i){
  errors_expected_verilator[i].location.file = file;
}
linter.lint_from_file(file).then(function(errors) {
  check_errors(errors,errors_expected_verilator);
}, function(err) {
  throw new Error(err);
});

console.log("------> Test OK.");


function check_errors(errors,expected){
  //Check lenght
  if (expected.length === errors.length){
    for (let i=0; i<errors.length;++i){
      //Check description
      if (expected[i].description !== errors[i].description){
        throw new Error('Fail description -> ' + i);
      }
      //Check error type
      if (expected[i].severity !== errors[i].severity){
        throw new Error('Fail error type -> ' + i);
      }
      //Check position 0
      if (expected[i].location.position[0] !== errors[i].location.position[0]){
        console.log(expected[i].location.position);
        console.log(errors[i].location.position);
        throw new Error('Fail error position 0 -> ' + i);
      }
      //Check position 1
      if (expected[i].location.position[1] !== errors[i].location.position[1]){
        console.log(expected[i].location.position);
        console.log(errors[i].location.position);
        throw new Error('Fail error position 1 -> ' + i);
      }
      //Check file
      if (expected[i].location.file !== errors[i].location.file){
        throw new Error('Fail error filename -> ' + i);
      }
    }
  }
  else{
    throw new Error('Error length');
  }
}


