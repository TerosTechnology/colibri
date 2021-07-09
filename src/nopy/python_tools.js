/* eslint-disable no-console */
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

async function get_python_exec(python_path) {
  if (python_path === undefined){
    python_path = '';
  }
  python_path = python_path.replace(/ /g, '\\ ');
  // Check custom python3 path
  if (python_path !== ''){
    python_path = `"${python_path}"`;
    let python_path_check = await check_custom_python_path(python_path);
    if (python_path_check === ''){
      console.log(`[colibri-nopy] Error current python3 path: ${python_path}`);
    }
    else{
      console.log(`[colibri-nopy] Current python3 path: ${python_path}`);
    }
    return python_path;
  }

  //Check system python3 path with binary python3
  let binary = 'python3';
  let python_path_check = await check_custom_python_path(binary);
  if (python_path_check !== ''){
    console.log(`[colibri-nopy] Current python3 path: ${python_path_check}`);
    return python_path_check;
  }

  //Check system python3 path with binary python
  binary = 'python';
  python_path_check = await check_custom_python_path(binary);
  console.log(`[colibri-nopy] Current python3 path: ${python_path_check}`);
  return python_path_check;
}

async function check_custom_python_path(python_path) {
  // eslint-disable-next-line max-len
  let command = `${python_path} -c "import sys; check_version = sys.version_info > (3,0); exit(0) if check_version == True else exit(-1)"`;
  let result_command = await _exec_command(command);
  if (result_command.error === 0) {
    return python_path;
  } else {
    return "";
  }
}

async function _exec_command(command) {
  const exec = require("child_process").exec;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      let error_code = 0;
      if (error !== undefined && error !== null){
        error_code = -1;
      }
      let result = { error: error_code, stdout: stdout, stderr: stderr };
      resolve(result);
    });
  });
}

async function exec_python_script(python3_path, python_script_path) {
  let python_path = await get_python_exec(python3_path);
  let command = `${python_path} ${python_script_path}`;
  console.log(`[colibri-nopy] Run python3 command: ${command}`);
  let result = await _exec_command(command);
  return result;
}

module.exports = {
  get_python_exec,
  exec_python_script,
};
