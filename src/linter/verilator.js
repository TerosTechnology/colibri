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

class Verilator extends Base_linter {
  constructor(path) {
    super(path);
    this.PARAMETERS = {
      'SYNT': "verilator --lint-only -bbox-sys --bbox-unsup -DGLBL",
      'SYNT_WINDOWS': "verilator.exe --lint-only -bbox-sys --bbox-unsup -DGLBL"
    };
  }

  // options = {custom_bin:"", custom_arguments:"", custom_path:""}
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
    let file_split_space = file.split('\\ ')[0];
    let errors_str = result.stderr;
    let errors_str_lines = errors_str.split(/\r?\n/g);
    let errors = [];
    // Parse output lines
    errors_str_lines.forEach((line) => {
      if(line.startsWith('%')){
        // remove the %
        line = line.substr(1);
                       
        // was it for a submodule
        if (line.search(file_split_space) > 0) {
          // remove the filename
          line = line.replace(file_split_space, '');
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
                'file': file.replace('\\ ',' '),
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
      if (terms[i] === ' ') {
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
