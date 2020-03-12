// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

const shell = require('shelljs');
const { dirname } = require('path');

class BaseLinter {
  constructor(path) {
    const pathOS = require('path');
    if (path != null)
      this.path = path + pathOS.sep;
    else
      this.path = "";
    this.OUTPUT = {
      OUT: 0,
      ERR: 1
    };
  }

  async lint(file) {
    var str;
    var cmd = this.path + this.PARAMETERS['SYNT'] + file;
    var element = this;

    const exec = require('child_process').exec;
     return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (element.PARAMETERS['OUTPUT'] == element.OUTPUT.OUT) {
          str = stdout
        } else if (element.PARAMETERS['OUTPUT'] == element.OUTPUT.ERR) {
          str = stderr
        }
       resolve(element.parseErrors(str, file));
      });
     });
  }

  parseErrors(str, file) {
    let errorRegex = this.PARAMETERS['ERROR']
    let errors = [];
    let result = errorRegex.exec(str);
    while (result !== null) {
      let severity;
      if (result[this.PARAMETERS['TYPEPOSITION']] !== undefined) {
        severity = result[this.PARAMETERS['TYPEPOSITION']];
      } else {
        severity = "error";
      }
      let cl = 0;
      if (result[this.PARAMETERS['COLUMNPOSITION']] == undefined) {
        cl = 0;
      } else {
        cl = parseInt(result[this.PARAMETERS['COLUMNPOSITION']]);
      }
      let error = {
        'severity': severity.toLowerCase(),
        'location': {
          'file': file,
          'position': [parseInt(result[this.PARAMETERS['ROWPOSITION']]), cl]
        },
        'description': result[this.PARAMETERS['DESCRIPTIONPOSITION']]
      };
      errors.push(error);
      result = errorRegex.exec(str);
    }
    return errors;
  }

}

module.exports = BaseLinter
