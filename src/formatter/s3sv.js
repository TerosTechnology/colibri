/* eslint-disable no-console */
// Copyright 2021 Julien Faucher
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
const path_lib = require('path');
const Base_formatter = require('./base_formatter');

class S3SV extends Base_formatter {
  constructor() {
    super();

    //let cpython3_path = vscode.workspace.getConfiguration('teroshdl.global').get("python3-path"); // string
    this.python3_path = "python3";

    this.use_tabs = false;
    this.indent_size = 2;
    this.one_bind_per_line = true;
    this.one_decl_per_line = false;
  }

  //Options: {custom_path:"/path/to/bin, custom_bin:"bin", style:"path/to/rules.json" extra_args:""}
  async format_from_code(code,options){

    this.python3_path =      options["python3_path"];
    this.use_tabs =          options["use_tabs"];
    this.indent_size =       options["indent_size"];
    this.one_bind_per_line = options["one_bind_per_line"];
    this.one_decl_per_line = options["one_decl_per_line"];

    let temp_file = await this._create_temp_file_of_code(code);
    let formatted_code = await this._format(temp_file,options);
    return formatted_code;
  }

  async _format(file){
    
    let entry = `"${__dirname}${path_lib.sep}bin${path_lib.sep}s3sv${path_lib.sep}verilog_beautifier.py"`;

    //Argument construction from members parameters
    let args = " ";
    
    args += `-s ${this.indent_size} `;
    if(this.use_tabs) {
      args += "--use-tabs ";
    }
    if (! this.one_bind_per_line) {
      args += "--no-oneBindPerLine ";
    }

    if (this.one_decl_per_line){
      args += "--oneDeclPerLine ";
    }

    args += `-i ${file}`;

    let cmd = this.python3_path + " " + entry + args;

    await this._exec_formatter(cmd);
    let formatted_code = fs.readFileSync(file, 'utf8');
    return formatted_code;
  }

  async _exec_formatter(command) {
    console.log(`[colibri][s3sv formatter] ${command}`);  
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
  S3SV: S3SV
};
