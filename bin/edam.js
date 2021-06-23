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

class Doc {
  constructor(doc_options) {
    this.doc_options = doc_options;
  }

  async gen_doc(options, mode, input_path, output_path) {
    let out_type = options.out;
    try {
      // Python3 path
      let pypath = options.pypath;

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
      let result = await this.save_doc(input_path, out_type, trs_file_content, output_path, pypath, mode);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async save_doc(trs_file_absolute, type, trs_file_content, path, pypath, mode){
    let config = this.configure_documenter();

    let doc_inst = new project_edam.Edam_project('');
    if (mode === 'yml'){
      doc_inst.load_edam_file(trs_file_content);
    }
    else if(mode === 'csv'){
      this.load_edam_csv(doc_inst, trs_file_content);
    }
    else if(mode === 'directory'){
      this.load_edam_directory(doc_inst, trs_file_absolute);
    }

     //Create output directory
     fs.mkdirSync(path,{ recursive: true });

    let result;
    if (type === 'html'){
      result = await doc_inst.save_html_doc(path, pypath, config);
    }
    if (type === 'markdown'){
      result = await doc_inst.save_markdown_doc(path, pypath, config);
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

  load_edam_directory(edam, directory_path){
    let file_list = this.getFilesFromDir(directory_path);
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

  getFilesFromDir (dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path_lib.join(dir, file);
        try {
            filelist = this.getFilesFromDir(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
            else throw err;
        }
    });
    return filelist;
  }

}


module.exports = {
  Doc: Doc,
};
