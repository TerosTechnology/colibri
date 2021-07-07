/* eslint-disable no-empty */
/* eslint-disable no-console */
// Copyright 2019
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

const python_tools = require("../nopy/python_tools");
const path_lib = require("path");
const fs = require("fs");
const utils = require("../utils/utils");

class Dependency_graph {
  constructor() {
    this.dependency_graph_svg = "";
  }

  async create_dependency_graph(project, python3_path) {
    let clean_project = this.clean_non_hdl_files(project);

    const project_files_path = path_lib.join(__dirname, 'json_project_dependencies.json');
    let project_files_json = JSON.stringify(clean_project);
    fs.writeFileSync(project_files_path, project_files_json);

    let python_script_path = `"${__dirname}${path_lib.sep}vunit_dependency.py" "${project_files_path}"`;
    let result = await python_tools.exec_python_script(
      python3_path,
      python_script_path
    );
    let dep_graph = '';
    if (result.error === 0){
      dep_graph = result.stdout;
    }
    return dep_graph;
  }

  clean_non_hdl_files(project){
    let files = project.files;
    let hdl_files = [];
    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      let check_hdl = utils.check_if_hdl_file(element.name);
      if (check_hdl === true){
        hdl_files.push(element);
      }
    }
    let clean_project = JSON.parse(JSON.stringify(project));
    clean_project.files = hdl_files;
    return clean_project;
  }

  async get_dependency_tree(project, pypath) {
    let clean_project = this.clean_non_hdl_files(project);

    const project_files_path = path_lib.join(__dirname, 'json_project_dependencies.json');
    const tree_graph_output = path_lib.join(__dirname, 'tree_graph_output.json');

    let project_files_json = JSON.stringify(clean_project);
    fs.writeFileSync(project_files_path, project_files_json);

    let python_script_path = `"${__dirname}${path_lib.sep}vunit_dependencies_standalone.py" "${project_files_path}"`;
    let result = await python_tools.exec_python_script(
      pypath,
      python_script_path
    );
    let dep_tree = [];
    if (result.error === 0){
      try{
        let rawdata = fs.readFileSync(tree_graph_output);
        dep_tree = JSON.parse(rawdata);
      }
      catch(e){
        return dep_tree;
      }
    }
    return dep_tree;
  }

  async get_dependency_graph_svg(project, python3_path) {
    let dependencies = await this.create_dependency_graph(project, python3_path);
    try{
      const Viz = require("./viz/viz");
      const worker = require("./viz/full.render");
      var viz = new Viz(worker);
      return new Promise(function (resolve) {
        viz.renderString(dependencies).then(function (string) {
          resolve(string);
        });
      });
    }
    catch(e){}
  }
}

module.exports = {
  Dependency_graph: Dependency_graph,
};
