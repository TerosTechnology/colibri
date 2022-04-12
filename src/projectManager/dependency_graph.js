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
        this.init = false;
    }

    get_temporal_name(prefix) {
        const username = require("os").userInfo().username;
        const random_number = Math.floor(Math.random() * 10);
        const date_s = Math.floor(new Date() / 1000);
        const filename = `${prefix}_${username}_${random_number}_${date_s}.json`;

        const tmpdir = require('os').tmpdir();
        const tmp_name = path_lib.join(tmpdir, filename);
        return tmp_name;
    }

    remove_file(file_path) {
        if (fs.existsSync(file_path)) {
            fs.unlink(file_path, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }

    async create_dependency_graph(project, python3_path) {
        let clean_project = this.clean_non_hdl_files(project);

        const project_files_path = this.get_temporal_name('json_project_dependencies');
        let project_files_json = JSON.stringify(clean_project);
        fs.writeFileSync(project_files_path, project_files_json);

        let python_script_path = `"${__dirname}${path_lib.sep}vunit_dependency.py" "${project_files_path}"`;
        let result = await python_tools.exec_python_script(
            python3_path,
            python_script_path
        );
        let dep_graph = '';
        if (result.error === 0) {
            dep_graph = result.stdout;
        }

        this.remove_file(project_files_path);

        return dep_graph;
    }

    clean_non_hdl_files(project) {
        let files = project.files;
        let hdl_files = [];
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            let check_hdl = utils.check_if_hdl_file(element.name);
            if (check_hdl === true) {
                hdl_files.push(element);
            }
        }
        let clean_project = JSON.parse(JSON.stringify(project));
        clean_project.files = hdl_files;
        return clean_project;
    }

    async get_compile_order(project, pypath) {
        let clean_project = this.clean_non_hdl_files(project);

        const project_files_path = this.get_temporal_name('json_project_compile_order');
        const compile_order_output = this.get_temporal_name('teroshdl_compile_order');

        let project_files_json = JSON.stringify(clean_project);
        fs.writeFileSync(project_files_path, project_files_json);

        let python_script_path = `"${__dirname}${path_lib.sep}vunit_compile_order.py" "${project_files_path}" "${compile_order_output}"`;
        let result = await python_tools.exec_python_script(
            pypath,
            python_script_path
        );

        let compile_order = [];
        if (result.error === 0) {
            try {
                let rawdata = fs.readFileSync(compile_order_output);
                compile_order = JSON.parse(rawdata)['compile_order'];
            } catch (e) {
                this.remove_file(project_files_path);
                this.remove_file(compile_order_output);
                return compile_order;
            }
        }
        this.remove_file(project_files_path);
        this.remove_file(compile_order_output);
        return compile_order;
    }

    async get_dependency_tree(project, pypath) {
        let dep_tree = { 'root': undefined, 'error': 'Failed to process the project' };

        let configuration_check = await python_tools.check_python(pypath);
        if (configuration_check.vunit === false) {
            dep_tree.error = 'Configure your Python 3 path and install teroshdl ( pip install teroshdl )';
            return dep_tree;
        }

        let clean_project = this.clean_non_hdl_files(project);

        const project_files_path = this.get_temporal_name('json_project_dependencies');
        const tree_graph_output = this.get_temporal_name('tree_graph_output');

        let project_files_json = JSON.stringify(clean_project);
        fs.writeFileSync(project_files_path, project_files_json);

        let python_script_path = `"${__dirname}${path_lib.sep}vunit_dependencies_standalone.py" "${project_files_path}" "${tree_graph_output}"`;
        let result = await python_tools.exec_python_script(
            pypath,
            python_script_path
        );
        if (result.error === 0) {
            try {
                let rawdata = fs.readFileSync(tree_graph_output);
                dep_tree = JSON.parse(rawdata);
            } catch (e) {
                this.remove_file(project_files_path);
                this.remove_file(tree_graph_output);
                return dep_tree;
            }
        }
        this.remove_file(project_files_path);
        this.remove_file(tree_graph_output);
        return dep_tree;
    }

    async get_dependency_graph_svg(project, python3_path) {
        let dependencies = await this.create_dependency_graph(project, python3_path);
        let element = this;
        try {
            return new Promise(function(resolve) {
                if (element.init === false) {
                    const Viz = require("./viz/viz");
                    const worker = require("./viz/full.render");
                    element.viz = new Viz(worker);
                    element.init = true;
                }
                element.viz.renderString(dependencies).then(function(string) {
                    resolve(string);
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = {
    Dependency_graph: Dependency_graph,
};