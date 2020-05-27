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
const Base_linter = require('./base_linter')

class Verilator extends Base_linter {
  constructor(path) {
    super(path);
    this.PARAMETERS = {
      'SYNT': "verilator --lint-only -bbox-sys --bbox-unsup -DGLBL",
      'SYNT_WINDOWS': "verilator.exe --lint-only -bbox-sys --bbox-unsup -DGLBL"
    };
  }

  // options = {custom_bin:"", custom_arguments:""}
  async lint_from_file(file,options){
    let errors = await this._lint(file, options);
    return errors;
  }

  async lint_from_code(file,code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let errors = await this._lint(temp_file,options);
    return errors;
  }

  async _lint(file,synt,synt_windows,options){
    let result = await this._exec_linter(file,this.PARAMETERS.SYNT,
                          this.PARAMETERS.SYNT_WINDOWS,options);
    let errors_str = result.stderr;
    let errors_str_lines = errors_str.split(/\r?\n/g);
    let errors = [];
    // Parse output lines
    errors_str_lines.forEach((line) => {
      if(line.startsWith('%')){
        // remove the %
        line = line.substr(1);
                       
        // was it for a submodule
        if (line.search(file) > 0) {
          // remove the filename
          line = line.replace(file, '');
          line = line.replace(/\s+/g,' ').trim();
                       
          let terms = this.split_terms(line);
          let severity = this.getSeverity(terms[0]);
          let message = terms.slice(2).join(' ');
          let lineNum = parseInt(terms[1].trim()) - 1;
                        
          if (!isNaN(lineNum)){
            let error = {
              'severity' : severity,
              'description' : message,
              'location' : {
                'file': file,
                'position': [lineNum, 0]
              }
            };
            errors.push(error);
          }
        }
      }
    });
    return errors;
  }
  split_terms(line){
    let terms = line.split(':');
    for (var i = 0; i < terms.length; i++) {
      if (terms[i] == ' ') {
        terms.splice(i, 1);
        i--;
      }
      else
      {
        terms[i] = terms[i].trim();
      }
    }
    return terms;
   }
  getSeverity(severity_string){
    let severity = "";
    if (severity_string.startsWith('Error'))
    {
      severity = "error";
    }
    else if (severity_string.startsWith('Warning'))
    {
      severity = "warning;";
    }
    return severity;
  }
}

module.exports = {
  Verilator: Verilator
};
