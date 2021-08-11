/* eslint-disable no-console */
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
const Base_formatter = require("./base_formatter");

class Verible extends Base_formatter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT' : "verible-verilog-format ",
      'SYNT_WINDOWS' : "verible-verilog-format "
    };
  }

  async format_from_code(code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let formatted_code = await this._format(temp_file,options);
    if (formatted_code === undefined || formatted_code === ''){
      return code;
    }
    else{
      return formatted_code;
    }
  }

  async _format(file,options){
    let cmd = '';
    if (options === undefined || options.path === '' || options.path === undefined){
      cmd = this.PARAMETERS.SYNT + ' ';
    }
    else{
      cmd = options.path + ' ';
    }
    if (options !== undefined || options.args !== '' || options.args !== undefined){
      cmd += options.args + ' ';
    }

    cmd += file;

    let formatted_code = await this._exec_formatter(cmd);
    return formatted_code.stdout;
  }

  async _exec_formatter(command) {
    console.log(`[colibri][verible formatter] ${command}`);
    const exec = require("child_process").exec;
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        let result = { stdout: stdout, stderr: stderr };
        resolve(result);
      });
    });
  }
}

module.exports = {
  Verible: Verible
};