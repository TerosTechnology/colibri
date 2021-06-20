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

class Doc_edam {
  constructor(doc_options) {
    this.doc_options = doc_options;
  }

  doc_trs(options, mode) {
    let trs_file = options.file;
    let out_type = options.out;
    try {
      let pypath = options.python_path;
      let doc_path = process.cwd();
      if (options.outpath !== "") {
        doc_path = `${options.outpath}`;
      }
      let trs_path = path_lib.dirname(trs_file);
      let final_dir = path_lib.join(path_lib.relative(trs_path, process.cwd()),doc_path);

      let trs_file_content = '';
      if (mode === 'yml'){
        trs_file_content = yaml.load(fs.readFileSync(trs_file, "utf8"));
      }
      else if (mode === 'csv'){
        trs_file_content = fs.readFileSync(trs_file, "utf8");
      }

      fs.mkdirSync(doc_path,{ recursive: true });
      shell.cd(trs_path);
      this.save_doc(out_type, trs_file_content, final_dir, pypath, mode);
    } catch (e) {
      console.log(e);
    }
  }

  async save_doc(type, trs_file_content, path, pypath, mode){
    let config = this.configure_documenter();

    let doc_inst = new project_edam.Edam_project('');
    if (mode === 'yml'){
      doc_inst.load_edam_file(trs_file_content);
    }
    else if(mode === 'csv'){
      this.load_edam_csv(doc_inst, trs_file_content);
    }

    if (type === 'html'){
      await doc_inst.save_html_doc(path, pypath, config);
    }
    if (type === 'markdown'){
      await doc_inst.save_markdown_doc(path, pypath, config);
    }
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
}
module.exports = {
  Doc_edam: Doc_edam,
};
