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

class Ghdl extends Base_linter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT' : "ghdl -s -fno-color-diagnostics",
      'SYNT_WINDOWS' : "ghdl -s -fno-color-diagnostics",
      'ERROR' : /[\t\n ]*(.+){1}[\t]*.vhd:*([0-9]+):([0-9]+):*[\t ]*(error|warning)*:*[\t ]*(.+)/g,
      'TYPEPOSITION': 4,
      'ROWPOSITION': 2,
      'COLUMNPOSITION': 3,
      'DESCRIPTIONPOSITION': 5
    };
  }

  // options = {custom_bin:"", custom_arguments:""}
  async lint_from_file(file,options){
    let normalized_file = file.replace(' ','\\ ');
    let errors = await this._lint(normalized_file, options);
    return errors;
  }

  async lint_from_code(file,code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let errors = await this._lint(temp_file,options);
    return errors;
  }

  async _lint(file,options){
    let result = await this._exec_linter(file,this.PARAMETERS.SYNT,
                          this.PARAMETERS.SYNT_WINDOWS,options);
    file = file.replace('\\ ',' ');
    let errors_str = result.stderr;
    let errors_str_lines = errors_str.split(/\r?\n/g);
    let errors = [];
    errors_str_lines.forEach((line) => {
      if(line.startsWith(file)){
          line = line.replace(file, '');
          let terms = line.split(':');
          let line_num = parseInt(terms[1].trim());
          let column_num = parseInt(terms[2].trim());
          if(terms.length == 4){
            let error = {
              'severity' : "error",
              'description' : terms[3].trim(),
              'location' : {
                'file': file,
                'position': [line_num, column_num]
              }
            };
            errors.push(error);
          }
          else if(terms.length >= 4){
            let sev;
            if(terms[2].trim() == 'error'){
              sev = "error";
            }
            else if(terms[2].trim() == 'warning'){
              sev = "warning";
            }
            else{
              sev = "information";
            }
            let error = {
              'severity' : sev,
              'description' : terms[3].trim(),
              'location' : {
                'file': file,
                'position': [line_num, column_num]
              }
            };
            errors.push(error);
          }
        }
    });
    return errors;
  }


}





module.exports = {
  Ghdl: Ghdl
};
