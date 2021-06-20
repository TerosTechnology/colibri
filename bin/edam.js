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
// let colibri = require("../src/main.js");
let project_edam = require("../src/projectManager/edam.js");

class Doc_edam {
  constructor(doc_options) {
    this.doc_options = doc_options;
  }

  doc_trs(options) {
    let trs_file = options.edam;
    let out = options.out;
    try {
      let pypath = options.python_path;
      let doc_path = "built_doc";
      if (options.outpath !== "") {
        doc_path = `${options.outpath}/built_doc`;
      }
      let trs_path = path_lib.dirname(trs_file);
      let out_dir = `${trs_path}/${doc_path}`;
      fs.mkdirSync(out_dir,{ recursive: true });
      trs_file = yaml.load(fs.readFileSync(trs_file, "utf8"));
      shell.cd(trs_path);
      this.doc_trs_ip(trs_file, doc_path, out, pypath);
    } catch (e) {
      console.log(e);
    }
  }

  doc_trs_ip(trs_file, path, out, pypath) {
    switch (out) {
      case "html":
        this.save_doc_html_trs(trs_file, path, pypath);
        break;
      case "md":
        this.save_doc_md_trs(trs_file, path, pypath);
        break;
      default:
        console.log(
          "Output format not set or invalid. Saving documentation in Markdown by default."
        );
        this.save_doc_md_trs(trs_file, path, pypath);
        break;
    }
  }

  async save_doc_md_trs(trs_file, path, pypath) {
    let config = this.configure_documenter();

    let doc_inst = new project_edam.Edam_project();
    doc_inst.load_edam_file(trs_file);
    doc_inst.save_markdown_doc(path, pypath, config);
  }

  async save_doc_html_trs(trs_file, path, pypath) {
    let config = this.configure_documenter();

    let doc_inst = new project_edam.Edam_project();
    doc_inst.load_edam_file(trs_file);
    doc_inst.save_html_doc(path, pypath, config);
  }

  configure_documenter() {
    if (this.doc_options !== undefined) {
      let config = {
        dependency_graph: this.doc_options.dependency_graph,
        fsm: this.doc_options.fsm,
        signals: this.doc_options.signals,
        constants: this.doc_options.constants,
        process: this.doc_options.process,
        symbol_vhdl: this.doc_options.symbol_vhdl,
        symbol_verilog: this.doc_options.symbol_verilog
      };
      return config;
    }
    else{
      let global_config = {
        dependency_graph: false,
        fsm: true,
        signals: "none",
        constants: "none",
        process: "none",
        symbol_vhdl: "!",
        symbol_verilog: "!"
      };
      return global_config;
    }
  }
}
module.exports = {
  Doc_edam: Doc_edam,
};
