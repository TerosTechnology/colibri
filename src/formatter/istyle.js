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

const fs = require('fs');
const os = require('os');
const path_lib = require('path');
const Base_formatter = require('./base_formatter');

class Istyle extends Base_formatter {
  constructor() {
    super();
  }

  //Options: {custom_path:"/path/to/bin, custom_bin:"bin", style:"path/to/rules.json" extra_args:""}
  async format_from_code(code,options){
    let temp_file = await this._create_temp_file_of_code(code);
    let formatted_code = await this._format(temp_file,options);
    return formatted_code;
  }

  async _format(file,options){
    let path_bin = `${__dirname}${path_lib.sep}bin${path_lib.sep}svistyle${path_lib.sep}`;
    let platform = os.platform();
    if (platform === "darwin"){
      path_bin += "istyle-darwin";
    }
    else if (platform === "linux"){
      path_bin += "istyle-linux";
    }
    else if (platform === "win32"){
      path_bin += "istyle-win32.exe";
    }

    let synt = "";
    if (options !== undefined && options.style !== undefined){
      synt = `${path_bin} --style=ansi `;
    }
    else{
      synt = `${path_bin} --style=${options.style} `;
    }

    if (options !== undefined && options.extra_args !== undefined){
      synt += options.extra_args;
    }
    synt += file;

    await this._exec_formatter(synt);
    let formatted_code = fs.readFileSync(file, 'utf8');
    return formatted_code;
  }

  async _exec_formatter(command) {
    console.log(`[colibri][istyle formatter] ${command}`);  
    const exec = require('child_process').exec;
      return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
          let result = {'stdout':stdout,'stderr':stderr};
          resolve(result);
      });
    });
  }

}

module.exports = {
  Istyle: Istyle
};