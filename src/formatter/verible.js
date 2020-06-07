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
const Base_formatter = require('./base_formatter');

class Verible extends Base_formatter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT' : "verilog_format ",
      'SYNT_WINDOWS' : "verilog_format "
    };
  }

  //Options: {path:"/path/to/bin"}
  async format_from_code(code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let formatted_code = await this._format(temp_file,options);
    return formatted_code;
  }

  async _format(file,options){
    let formatted_code = await this._exec_linter(file,this.PARAMETERS.SYNT,
                          this.PARAMETERS.SYNT_WINDOWS,options);
    return formatted_code.stdout;
  }
}

module.exports = {
  Verible: Verible
};