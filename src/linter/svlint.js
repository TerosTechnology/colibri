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
const General = require('../general/general');
const Base_linter = require('./base_linter');
const os = require('os');
const path_lib = require('path');
const { path } = require('temp');

class Svlint extends Base_linter {
  constructor(language) {
    super(language);
  }

  // options = {custom_bin:"", custom_arguments:"", custom_path:""}
  async lint_from_file(file, options) {
    let normalized_file = file.replace(' ', '\\ ');
    let errors = await this._lint(normalized_file, options);
    return errors;
  }

  async lint_from_code(file, code, options) {
    let temp_file = await this._create_temp_file_of_code(code);
    let errors = await this._lint(temp_file, options);
    return errors;
  }

  async _exec_linter(file, options) {
    let custom_config = '';
    if (options !== undefined && options.custom_config !== undefined && options.custom_config !== '') {
      custom_config += options.custom_config;
    }
    else {
      custom_config = `${__dirname}${path_lib.sep}.svlint.toml`;
    }

    let command = `${__dirname}${path_lib.sep}bin${path_lib.sep}`;
    if (os.platform() === "win32") {
      command += "svlint-win.exe -1";
    }
    else if (os.platform() === "darwin") {
      command += "svlint-mac -1";
    }
    else if (os.platform() === "linux") {
      command += "svlint-linux -1";
    }
    command += " -c " + custom_config + " " + file;

    const exec = require('child_process').exec;
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        let result = { 'stdout': stdout, 'stderr': stderr };
        resolve(result);
      });
    });
  }

  async _lint(file, options) {
    let result = await this._exec_linter(file, options);
    let file_split_space = file.split('\\ ')[0];
    let errors_str = result.stdout;
    let errors_str_lines = errors_str.split(/\r?\n/g);
    let errors = [];
    try {
      // Parse output lines
      errors_str_lines.forEach((line) => {
        // was it for a submodule
        if (line.search(file_split_space) > 0) {
          // remove the filename
          line = line.replace(file_split_space, '');

          let terms = this.split_terms(line);
          let severity = this.getSeverity(terms[0]);
          let message = terms[2];
          let lineNum = parseInt(terms[1].split(':')[1]) - 1;
          let columnNum = parseInt(terms[1].split(':')[2]) - 1;

          if (!isNaN(lineNum)) {
            let error = {
              'severity': severity,
              'description': message,
              'location': {
                'file': file.replace('\\ ', ' '),
                'position': [lineNum, columnNum]
              }
            };
            errors.push(error);
          }
        }
      });
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return errors;
  }
  split_terms(line) {
    let terms = [];
    let split_line = line.split('\t', 2);
    terms.push(split_line[0]);
    terms.push(split_line[1]);
    terms.push(line.split('\thint: ')[1]);
    return terms;
  }
  getSeverity(severity_string) {
    let severity = "warning";
    if (severity_string.startsWith('Fail')) {
      severity = "error";
    }
    else if (severity_string.startsWith('Error')) {
      severity = "error";
    }
    else if (severity_string.startsWith('Warning')) {
      severity = "warning";
    }
    return severity;
  }
}

module.exports = {
  Svlint: Svlint
};
