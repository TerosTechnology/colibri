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
const temp = require('temp');
const fs = require('fs');

class Vsg {
  constructor() {
  }

  async lint_from_file(file,options){
    let temp_file_junit = await this._create_temp_file_of_code("");
    let output_junit = await this._svg_exec(file, temp_file_junit);
    let errors = this._parse_junit(output_junit);
    return errors;
  }

  async lint_from_code(code,options){
    let temp_file_code = await this._create_temp_file_of_code(code);
    let temp_file_junit = await this._create_temp_file_of_code("");
    let output_junit = await this._svg_exec(temp_file_code, temp_file_junit);
    let errors = await this._parse_junit(output_junit);
    return errors;
  }

  async _parse_junit(junit_content){
    const json = await JSON.parse(junit_content);
    let errors = [];
    if (json.files !== undefined && json.files[0] !== undefined && json.files[0].violations !== undefined){
      let errors_json = json.files[0].violations;
      for (let i=0; i<errors_json.length; ++i){
        let error = {
          'severity' : 'warning',
          'code' : errors_json[i].rule,
          'description' : "[" + errors_json[i].rule + "] " + errors_json[i].solution,
          'location' : {
            'file': "file",
            'position': [errors_json[i].linenumber-1, 0]
          }
        };
        errors.push(error);
      }
      return errors;
    }
    else{
      return errors;
    }
  }

  async _svg_exec(code_file, junit_file) {  
    let code_file_normalized = code_file.replace(' ','\\ ');
    let json_file_file_normalized = junit_file.replace(' ','\\ ');
    let command = `vsg -f ${code_file_normalized} --all_phases --js ${json_file_file_normalized}`;  
    const exec = require('child_process').exec;
      return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          // eslint-disable-next-line no-unused-vars
          let result = {'stdout':stdout,'stderr':stderr};
          let output_junit = fs.readFileSync(json_file_file_normalized, 'utf8');
          resolve(output_junit);
      });
    });
  }

  async _create_temp_file_of_code(content) {
    const temp_file = await temp.openSync();
    if (temp_file === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "Unable to create temporary file";
    }
    fs.writeSync(temp_file.fd, content);
    fs.closeSync(temp_file.fd);
    return temp_file.path;
  }
}

module.exports = {
  Vsg: Vsg
};
