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
const path = require('path');
const temp = require('temp');
const fs = require('fs');
const nopy = require('../nopy/api');
const ts_parser = require('./ts_vhdl_parser');

class VhdlParser {
  constructor(comment_symbol) {
    this.comment_symbol = comment_symbol;
  }

  async getAll(str) {
    const MAX_ARG_LENGTH = 32767;
    let reduce_str = str.slice(0, MAX_ARG_LENGTH);
    let code_file = this._create_temp_file_of_code(reduce_str);

    let structure = undefined;
    try {

      let python_exec_path = await nopy.get_python_exec();
      let py_path = __dirname + path.sep + "parser.py";
      let args = code_file + ',' + this.comment_symbol;
      let current_element = this;
      if (python_exec_path === undefined) {
        return undefined;
      }

      let parser = new ts_parser.Parser(this.comment_symbol);
      await parser.init();
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve, reject) {
        nopy.spawnPython([py_path, args], {
          interop: "buffer",
          // eslint-disable-next-line no-unused-vars
          execPath: python_exec_path
        }).then(({ code, stdout, stderr }) => {
          try {
            if (stdout === "null\n" || stdout === "null\r") {
              structure = undefined;
            }
            else {
              structure = JSON.parse(stdout);
            }
          }
          catch (e) {
            structure = undefined;
          }

          let elements = parser.get_all(str);
          structure.body = elements.body;
          structure.declarations = elements.declarations;

          resolve(structure);
        });
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-console
      console.error("Error parsing.");
    }
    return structure;
  }

  _create_temp_file_of_code(content) {
    const temp_file = temp.openSync();
    if (temp_file === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "Unable to create temporary file";
    }
    fs.writeSync(temp_file.fd, content);
    fs.closeSync(temp_file.fd);
    return temp_file.path;
  }
}

module.exports = VhdlParser;
