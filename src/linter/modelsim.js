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
const General = require('../general/general');

class Modelsim extends Base_linter {

  constructor(language) {
    super(language);
    // VHDL
    if (language !== undefined && language === General.LANGUAGES.VHDL) {
      this.PARAMETERS = {
        'SYNT': "vcom -quiet -nologo -2008"
      };
    }
    // SystemVerilog
    else if (language !== undefined && language === General.LANGUAGES.SYSTEMVERILOG) {
      this.PARAMETERS = {
        'SYNT': "vlog -quiet -nologo -sv"
      };
    }
    // Verilog
    else {
      this.PARAMETERS = {
        'SYNT': "vlog -quiet -nologo"
      };
    }
  }

  // options = {custom_bin:"", custom_arguments:""}
  async lint_from_file(file, options, libraries) {
    let libraries_command = '';
    if (libraries !== undefined) {
      libraries_command = this.get_libraries_command(libraries, file);
    }

    let errors = await this._lint(file, options, libraries_command);
    return errors;
  }

  get_libraries_command(libraries, current_file) {
    let is_in_prj = false;
    try {
      let libraries_cmd = '';
      for (let i = 0; i < libraries.length; i++) {
        const lib = libraries[i];
        for (let j = 0; j < lib.files.length; j++) {
          const file = lib.files[j];
          if (current_file !== file) {
            if (lib.name === '') {
              libraries_cmd += ` -work work ${file}`;
            }
            else {
              libraries_cmd += ` -work ${lib.name} ${file}`;
            }
          }
          else {
            is_in_prj = true;
          }
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

    // Parse output lines
    errors_str_lines.forEach((line) => {
      if (line.startsWith('**')) {
        // eslint-disable-next-line max-len
        let regex_exp = /(Error|Warning).+?(?: *?(?:.+?(?:\\|\/))+.+?\((\d+?)\):|)(?: *?near "(.+?)":|)(?: *?\((.+?)\)|) +?(.+)/gm;
        // From https://github.com/dave2pi/SublimeLinter-contrib-vlog/blob/master/linter.py
        let m = regex_exp.exec(line);
        try {
          //Severity
          let sev = "warning";
          if (m[1] === "Error") {
            sev = "error";
          }
          else if (m[1] === "Warning") {
            sev = "warning";
          }
          else {
            sev = "note";
          }

          if (sev !== "note") {
            let message = m[5];
            let code = m[4];
            let line = parseInt(m[2]) - 1;

            let error = {
              'severity': sev,
              'description': message,
              'code': code,
              'location': {
                'file': file,
                'position': [line, 0]
              }
            };
            errors.push(error);
          }
        }
        catch (e) {
          // eslint-disable-next-line no-console
          // console.log(e);
        }
      }
    });
    return errors;
  }
}

module.exports = {
  Modelsim: Modelsim
};
