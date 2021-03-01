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

const nopy = require('../nopy/api');
const path_lib = require('path');
const Viz = require('./viz/viz');
const worker = require('./viz/full.render');

class Dependency_graph {
  constructor(graph) {
    this.graph = graph;
    this.dependency_graph_svg = "";
  }

  async create_dependency_graph(sources, python3_path) {
    let str = "";
    if (sources.length !== 0) {
      for (let i = 0; i < sources.length - 1; ++i) {
        str += sources[i]['name'] + ",";
      }
      str += sources[sources.length - 1]['name'];
    }
    let python_exec_path = python3_path;
    if (python3_path === '') {
      python_exec_path = await nopy.get_python_exec();
    }

    let py_path = __dirname + path_lib.sep + "vunit_dependency.py";
    if (python_exec_path === undefined || python_exec_path === '') {
      return undefined;
    }
    // eslint-disable-next-line no-unused-vars
    return new Promise(function (resolve, reject) {
      nopy.spawnPython([py_path, str], {
        interop: "buffer",
        // eslint-disable-next-line no-unused-vars
        execPath: python_exec_path
      }).then(({ code, stdout, stderr }) => {
        resolve(stdout);
      })
      .catch((e) => {
        resolve(undefined);
        console.log(e);
        // Handle the error!
      })
    });
  }
  async get_dependency_graph_svg(sources, python3_path) {
    let dependencies = await this.create_dependency_graph(sources, python3_path);
    var viz = new Viz(worker);
    return new Promise(function (resolve) {
      viz.renderString(dependencies).then(function (string) {
        resolve(string);
      });
    });
  }
}

module.exports = {
  Dependency_graph: Dependency_graph,
};
