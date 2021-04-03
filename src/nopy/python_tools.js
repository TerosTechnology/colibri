// Copyright 2021
// Carlos Alberto Ruiz Naranjo, Ismael Pérez Rojo,
// Alfredo Enrique Sáez Pérez de la Lastra
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

async function get_python_exec() {
  let command = "python3 --version";
  let result_command = await _exec_command(command);
  //python3 exec exists
  if (result_command.stderr === "") {
    return "python3";
  } else {
    return "python";
  }
}

async function _exec_command(command) {
  const exec = require("child_process").exec;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      let result = { error: error, stdout: stdout, stderr: stderr };
      resolve(result);
    });
  });
}

async function exec_python_script(python3_path, python_script_path) {
  let python_path = python3_path;
  if (python3_path === "" || python3_path === undefined) {
    python_path = await get_python_exec();
  }
  let command = `${python_path} ${python_script_path}`;
  let result = await _exec_command(command);
  return result;
}

module.exports = {
  exec_python_script,
};
