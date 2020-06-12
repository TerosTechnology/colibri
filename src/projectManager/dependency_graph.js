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

const nopy = require('nopy');
const path_lib = require('path');

class Dependency_graph {
  constructor(graph){
    this.graph = graph;
    this.dependency_graph_svg = "";
  }

  async create_dependency_graph(sources) {
    let str = "";
    if (sources.length !== 0){
      for (let i=0;i<sources.length-1;++i){
        str += sources[i]['name'] + ",";
      }
      str += sources[sources.length-1]['name'];
    }

    let py_path = __dirname + path_lib.sep + "vunit_dependency.py";
    return new Promise(function(resolve, reject) {
      nopy.spawnPython([py_path, str], { interop: "buffer" }).then(({ code, stdout, stderr }) => {
        resolve(stdout);
      });
    });
  }
}

module.exports = {
  Dependency_graph : Dependency_graph,
};
