// Copyright 2021 Teros Technology
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
/* eslint-disable no-console */

const fs = require("fs");
const shell = require("shelljs");
const path_lib = require("path");
const yaml = require("js-yaml");
let project_edam = require("../src/projectManager/edam.js");
const utils = require('../src/utils/utils');
const documenter_lib = require('../src/documenter/documenter');

class Doc {
  constructor(doc_options) {
    this.doc_options = doc_options;
  }

  async gen_doc(options, mode, input_path, output_path) {
    let recursive = options.recursive;
    let out_type = options.out;
    try {
      //Read content input
      let trs_file_content = '';
      if (mode === 'yml'){
        trs_file_content = yaml.load(fs.readFileSync(input_path, "utf8"));
      }
      else if (mode === 'csv'){
        trs_file_content = fs.readFileSync(input_path, "utf8");
      }
 
      // cd to input_path
      let input_path_dir = path_lib.dirname(input_path);
      shell.cd(input_path_dir);
      let result = await this.save_doc(input_path, out_type, trs_file_content, output_path, mode, recursive);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async save_doc(trs_file_absolute, type, trs_file_content, path, mode, recursive){
    let config = this.configure_documenter();

    const cliProgress = require('cli-progress');
    const cli_bar = new cliProgress.SingleBar({
      format: 'Progress |' + '{bar}' + '| {percentage}% || {value}/{total} || {filename}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      clearOnComplete: true
    });

    let edam_project = new project_edam.Edam_project('', {}, cli_bar);
    if (mode === 'yml'){
      edam_project.load_edam_file(trs_file_content);
    }
    else if(mode === 'file'){
      let result_error = await save_one_file(trs_file_absolute, config, type, path);
      let ok_file = 1;
      let fail_files = 0;
      if (result_error === true){
        fail_files = 1;
        ok_file = 0;
      }
      return {fail_files: fail_files, ok_files: ok_file};
    }
    else if(mode === 'csv'){
      this.load_edam_csv(edam_project, trs_file_content);
    }
    else if(mode === 'directory'){
      this.load_edam_directory(edam_project, trs_file_absolute, recursive);
    }

     //Create output directory
     fs.mkdirSync(path,{ recursive: true });

    let result;
    if (type === 'html'){
      result = await edam_project.save_html_doc(path, config);
    }
    if (type === 'markdown'){
      result = await edam_project.save_markdown_doc(path, config);
    }
    return result;
  }

  load_edam_csv(edam, content){
    let file_list_array = content.split(/\r?\n/);

    for (let i = 0; i < file_list_array.length; ++i) {
      let element = file_list_array[i];
      if (element.trim() !== ''){
        try{
          let lib_inst = element.split(',')[0].trim();
          let file_inst = element.split(',')[1].trim();
          if (lib_inst === ""){
            lib_inst = "";
          }
          edam.add_file(file_inst, false, "", lib_inst);
        }
        catch(e){
          console.log(e);
          return;
        }
      }
    }
  }

  load_edam_directory(edam, directory_path, recursive){
    let file_list = [];
    if (recursive === false){
      file_list = fs.readdirSync(directory_path);
    }
    else{
      file_list = this.get_files_from_dir_recursive(directory_path);
    }
    for (let i = 0; i < file_list.length; i++) {
      const element = file_list[i];
      const lang = utils.get_lang_from_path(element);
      if (lang !== 'none'){
        edam.add_file(element, false, "", "");
      }
    }
  }

  configure_documenter() {
    if (this.doc_options !== undefined) {
      return this.doc_options;
    }
    else{
      let global_config = {
        dependency_graph: false,
        fsm: true,
        signals: "none",
        constants: "none",
        process: "none",
        symbol_vhdl: "!",
        symbol_verilog: "!",
        self_contained: false
      };
      return global_config;
    }
  }

  get_files_from_dir_recursive (dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path_lib.join(dir, file);
        try {
            filelist = this.get_files_from_dir_recursive(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
            else throw err;
        }
    });
    return filelist;
  }

}

async function save_one_file(input_file, config, type, output_path){
  let complete_output_path = output_path;
  let is_directory = fs.lstatSync(output_path).isDirectory();
  if (is_directory === true){
    if (type === 'html'){
      complete_output_path = path_lib.join(complete_output_path, 'README.html');
    }
    else{
      complete_output_path = path_lib.join(complete_output_path, 'README.md');

    }
  }

  let lang = utils.get_lang_from_path(input_file);
  let code = fs.readFileSync(input_file, "utf8");
  let symbol;
  if (lang === 'vhdl'){
    symbol = config.symbol_vhdl;
  }
  else{
    symbol = config.symbol_verilog;
  }
  let documenter = new documenter_lib.Documenter(code, lang, symbol, config);
  documenter.set_symbol(symbol);
  documenter.set_code(code);
  documenter.set_config(config);

  let result;
  if (type === 'html'){
    result = await documenter.save_html(complete_output_path);
  }
  else if (type === 'markdown'){
    result = await documenter.save_markdown(complete_output_path);
  }
  return result;
}

module.exports = {
  Doc: Doc,
};
