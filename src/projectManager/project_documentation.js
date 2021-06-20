// Copyright 2020-2021 Teros Technology
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
const Project_documentation = require('../documenter/project_documentation');
const dependency = require('./dependency_graph');

class Project_documenter{ 
  constructor(){
    this.dependency_graph = new dependency.Dependency_graph();
  }

  async save_markdown_doc(output_dir_doc, python3_path, config) {
    await this.save_doc('markdown', output_dir_doc, python3_path, config);
  }

  async save_html_doc(output_dir_doc, python3_path, config) {
      await this.save_doc('html', output_dir_doc, python3_path, config);
  }
  
  async save_doc(type, output_dir_doc, python3_path, config) {
    let project = this.get_json_prj();
    let svg_dependency_graph;
    if (config.dependency_graph === true) {
      svg_dependency_graph = await this.dependency_graph.get_dependency_graph_svg(project, python3_path);
    }

    if (type === 'html'){
      Project_documentation.get_html_doc_from_project(project, output_dir_doc, svg_dependency_graph, config);
    }
    else if(type === 'markdown'){
      Project_documentation.get_md_doc_from_project(project, output_dir_doc, svg_dependency_graph, config); 
    }
  }

  async get_dependency_graph_dot(python3_path) {
    let project = this.get_json_prj();
    return await this.dependency_graph.create_dependency_graph(project, python3_path);
  }
}

module.exports = {
  Project_documenter : Project_documenter
};
