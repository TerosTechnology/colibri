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

class Icarus extends Base_linter {
  constructor() {
    super();
    this.PARAMETERS = {
      'SYNT': "iverilog -Wall",
      'SYNT_WINDOWS': "iverilog.exe -Wall"
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
    try {
      file = file.replace('\\ ',' ');
      let errors_str = result.stderr;
      let errors_str_lines = errors_str.split(/\r?\n/g);
      let errors = [];
      errors_str_lines.forEach((line) => {
        if(line.startsWith(file)){
            line = line.replace(file, '');
            let terms = line.split(':');
            let lineNum = parseInt(terms[1].trim()) - 1;
            if(terms.length === 3){
              let error = {
                'severity' : "error",
                'description' : terms[2].trim(),
                'location' : {
                  'file': file,
                  'position': [lineNum, 0]
                }
              };
              errors.push(error);
            }
            else if(terms.length >= 4){
              let sev;
              if(terms[2].trim() === 'error'){
                sev = "error";
              }
              else if(terms[2].trim() === 'warning'){
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
                  'position': [lineNum, 0]
                }
              };
              errors.push(error);
            }
          }
      });
      return errors;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return [];
    }
  }
}

module.exports = {
  Icarus: Icarus
};
