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
let colibri = require("../src/main.js");

class Doc_edam {
  constructor(doc_options) {
    this.doc_options = doc_options;
  }

  doc_trs(options) {
    let trs_file = options.file;
    let out = options.out;
    try {
      let doc_path = "built_doc";
      let trs_path = path_lib.dirname(trs_file);
      let out_dir = `${trs_path}/${doc_path}`;
      fs.mkdirSync(out_dir);
      const doc = yaml.load(fs.readFileSync(trs_file, "utf8")); //const doc = JSON.parse(fs.readFileSync(trs_file, 'utf8'));
      shell.cd(trs_path);
      this.doc_trs_ip(doc, doc_path, out);
    } catch (e) {
      console.log(e);
    }
  }

  doc_trs_ip(doc, path, out) {
    let file_list = [];
    let project_name = doc.name;
    for (let x = 0; x < doc.files.length; x++) {
      file_list.push(doc.files[x].name);
    }
    switch (out) {
      case "html":
        this.save_doc_html_trs(file_list, path, project_name);
        break;
      case "md":
        this.save_doc_md_trs(file_list, path, project_name);
        break;
      default:
        console.log("Output format not set or invalid. Saving documentation in Markdown by default.");
        this.save_doc_md_trs(file_list, path, project_name);
        break;
    }
  }

  async save_doc_md_trs(files, path, project_name) {
    let symbol_vhdl = "!";
    let symbol_verilog = "!";

    let config = {
      custom_section: undefined,
      custom_svg_path: undefined,
      custom_svg_path_in_readme: undefined,
      fsm: true,
      signals: "none",
      constants: "none",
      process: "none",
    };

    let with_dependency_graph = true;
    let python3_path = "";

    let dependency_graph = new dependency.Dependency_graph();
    let svg_dependency_graph = await dependency_graph.get_dependency_graph_svg(
      gen_names_str(files),
      python3_path
    );
    colibri.Documenter.get_md_doc_from_array(
      files,
      path,
      symbol_vhdl,
      symbol_verilog,
      svg_dependency_graph,
      project_name,
      with_dependency_graph,
      config
    );
  }

  async save_doc_html_trs(files, path, project_name) {
    let symbol_vhdl = "!";
    let symbol_verilog = "!";

    let config = {
      custom_section: undefined,
      custom_svg_path: undefined,
      custom_svg_path_in_readme: undefined,
      fsm: true,
      signals: "none",
      constants: "none",
      process: "none",
    };

    let with_dependency_graph = true;
    let python3_path = "";

    let dependency_graph = new dependency.Dependency_graph();
    let svg_dependency_graph = await dependency_graph.get_dependency_graph_svg(
      gen_names_str(files),
      python3_path
    );
    colibri.Documenter.get_html_doc_from_array(
      files,
      path,
      symbol_vhdl,
      symbol_verilog,
      svg_dependency_graph,
      project_name,
      with_dependency_graph,
      config
    );
  }

  gen_names_str(files) {
    let sources = [];
    for (let i = 0; i < files.length; i++) {
      sources.push({ name: files[i] });
    }
    return sources;
  }

  configure_documenter(documenter) {
    if (this.doc_options !== undefined) {
      documenter.set_config(this.doc_options);
      return;
    }
    let global_config = {
      dependency_graph: false,
      fsm: true,
      signals: "none",
      constants: "none",
      process: "none",
    };
    documenter.set_config(global_config);
  }
}

module.exports = {
  Doc_edam: Doc_edam,
};
