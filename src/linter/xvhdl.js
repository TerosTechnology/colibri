/*
 * @Author: your name
 * @Date: 2020-12-02 10:21:56
 * @LastEditTime: 2021-02-08 11:27:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /srsLTE_FPGA/home/carlos/repo/colibri/src/linter/xvhdl.js
 */
// The MIT License (MIT)

// Copyright (c) 2016 Masahiro H

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const Base_linter = require('./base_linter');

class Xvhdl extends Base_linter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "xvhdl -nolog",
      'SYNT_WINDOWS': "xvhdl -nolog"
    };
  }

  // options = {custom_bin:"", custom_arguments:""}
  async lint_from_file(file, options, libraries) {
    let libraries_command = '';
    if (libraries !== undefined) {
      libraries_command = this.get_libraries_command(libraries, file);
    }
    await this._delete_previus_lint();
    let normalized_file = file.replace(' ', '\\ ');
    let errors = await this._lint(normalized_file, options, libraries_command);
    return errors;
  }

  async _delete_previus_lint() {
    const os = require('os');
    const exec = require('child_process').exec;

    let command = '';
    if (os.platform() === "win32") {
      command = 'del xvhdl.pb && rmdir xsim.dir';
    }
    else {
      command = 'rm xvhdl.pb; rm -R xsim.dir';
    }
    await exec(command);
  }

  get_libraries_command(libraries, current_file) {
    let is_in_prj = false;
    try {
      let libraries_cmd = '';
      for (let i = 0; i < libraries.length; i++) {
        const lib = libraries[i];
        let libraries_cmd_i = '';
        for (let j = 0; j < lib.files.length; j++) {
          const file = lib.files[j];
          if (current_file !== file) {
            libraries_cmd_i += ` ${file} `;
          }
          else {
            is_in_prj = true;
          }
        }
        if (lib.name === '' && libraries_cmd_i !== '') {
          libraries_cmd += ` --work work ${libraries_cmd_i}`;
        }
        else if (libraries_cmd_i !== '') {
          libraries_cmd += ` --work ${lib.name} ${libraries_cmd_i}`;
        }
      }
      if (is_in_prj === false) {
        return '';
      }
      else {
        return libraries_cmd;
      }
    }
    catch (e) {
      return '';
    }
  }

  async lint_from_code(file, code, options) {
    let temp_file = await this._create_temp_file_of_code(code);
    let errors = await this._lint(temp_file, options);
    return errors;
  }

  async _lint(file, options, libraries_command) {
    let result = await this._exec_linter(file, this.PARAMETERS.SYNT,
      this.PARAMETERS.SYNT_WINDOWS, options, libraries_command);
    file = file.replace('\\ ', ' ');
    let errors_str = result.stdout;
    let errors_str_lines = errors_str.split(/\r?\n/g);
    let errors = [];
    errors_str_lines.forEach((line) => {

      let tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
      if (tokens.length < 4
        || tokens[0] !== "ERROR"
        || !tokens[1].startsWith("VRFC")) {
        return;
      }

      // Get filename and line number
      // eslint-disable-next-line no-unused-vars
      let [filename, lineno_str] = tokens[3].split(/:(\d+)/);
      let lineno = parseInt(lineno_str) - 1;

      // if (filename != doc.fileName) // Check that filename matches
      //     return;

      let error = {
        'severity': "error",
        'description': "[" + tokens[1] + "] " + tokens[2],
        'code': tokens[1],
        'location': {
          'file': file,
          'position': [lineno, 0]
        }
      };
      errors.push(error);
    });

    return errors;
  }
}

module.exports = {
  Xvhdl: Xvhdl
};
