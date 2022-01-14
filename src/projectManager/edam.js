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
const path_lib = require('path');
const prj_documenter = require('./project_documentation');
const utils = require('../utils/utils');
const dependency = require('./dependency_graph');
const fs = require('fs');

function json_edam_to_yml_edam(json_data) {
    const json2yaml = require('./json2yaml').json2yaml;
    let yaml = json2yaml(json_data);
    return yaml;
}

function yml_edam_str_to_json_edam(yml_str) {
    const yaml = require('js-yaml');
    let json_data = yaml.load(yml_str);
    return json_data;
}

class Edam_project extends prj_documenter.Project_documenter {

    constructor(name, tool_options = {}, cli_bar) {
        super(cli_bar);
        this.name = name;
        this.toplevel = '';
        this.files = [];
        this.tool_options = tool_options;
    }

    get_sources_as_array() {
        let sources = [];
        for (let i = 0; i < this.files.length; i++) {
            const element = this.files[i];
            sources.push(element.get_info().name);
        }
        return sources;
    }

    get_json_prj(tool_configuration, relative_path) {
        let files = [];
        for (let i = 0; i < this.files.length; i++) {
            const element = this.files[i];
            if (element.name !== '') {
                files.push(element.get_info(relative_path));
            }
        }

        let edam_json = {
            toplevel: this.toplevel,
            name: this.name,
            files: files,
            tool_options: tool_configuration,
        };
        return edam_json;
    }

    save_as_json(path, tool_configuration) {
        const fs = require("fs");
        let dir_path = path_lib.dirname(path);
        let edam_json = this.get_json_prj(tool_configuration, dir_path);
        let edam_str = JSON.stringify(edam_json);
        fs.writeFileSync(path, edam_str);
    }

    save_as_yml(path, tool_configuration) {
        const fs = require("fs");
        let dir_path = path_lib.dirname(path);
        let edam_json = this.get_json_prj(tool_configuration, dir_path);
        let edam_yml = json_edam_to_yml_edam(edam_json);
        fs.writeFileSync(path, edam_yml);
    }

    async set_top(path, library) {
        if (library === undefined) {
            library = '';
        }
        if (path === undefined) {
            return;
        }
        let toplevel = await utils.get_toplevel_from_path(path);
        this.toplevel = toplevel;
        this.toplevel_path = path;
        this.toplevel_library = library;
    }

    async set_top_from_toplevel(toplevel, library) {
        if (library === undefined) {
            library = '';
        }
        if (toplevel === undefined) {
            return;
        }
        let toplevel_path = '';
        for (let i = 0; i < this.files.length; i++) {
            const filename = this.files[i].name;
            let toplevel_file = await utils.get_toplevel_from_path(filename);
            if (toplevel_file === toplevel) {
                toplevel_path = filename;
                break;
            }
        }
        this.toplevel = toplevel;
        this.toplevel_path = toplevel_path;
        this.toplevel_library = library;
    }

    get_number_of_files() {
        return this.files.length;
    }

    set_name(name) {
        this.name = name;
    }

    export_edam_file() {
        let edam_file = {
            name: this.name,
            tool_options: {},
            toplevel: '',
            toplevel_path: this.toplevel_path,
            toplevel_library: this.toplevel_library,
        };
        let edam_files = [];
        for (let i = 0; i < this.files.length; i++) {
            const element = this.files[i];
            edam_files.push(element.get_info(''));
        }
        edam_file['files'] = edam_files;
        return edam_file;
    }

    load_edam_file(edam) {
        this.name = edam.name;
        this.tool_options = edam.tool_options;
        this.files = [];
        for (let i = 0; i < edam.files.length; i++) {
            const element = edam.files[i];

            let is_include_file = false;
            if (element.is_include_file !== undefined) {
                is_include_file = element.is_include_file;
            }

            let include_path = '';
            if (element.include_path !== undefined) {
                include_path = element.include_path;
            }

            let logic_name = '';
            if (element.logic_name !== undefined) {
                logic_name = element.logic_name;
            }

            this.add_file(element.name, is_include_file, include_path, logic_name);
        }
    }

    rename_logical_name(name, new_name) {
        for (let i = 0; i < this.files.length; ++i) {
            if (this.files[i].logical_name === name) {
                this.files[i].logical_name = new_name;
            }
        }
    }

    add_file(name, is_include_file = false, include_path = '', logic_name = '') {
        // File exists
        if (this.check_if_file_exist(name, logic_name) === true) {
            return;
        }
        let edam_file = new Edam_file(name, is_include_file, include_path, logic_name);
        this.files.push(edam_file);
    }

    check_if_file_exist(name, logic_name) {
        for (let i = 0; i < this.files.length; i++) {
            const element = this.files[i];
            if (element.name === name && element.logical_name === logic_name) {
                return true;
            }
        }
        return false;
    }


    delete_file(name, logic_name) {
        let new_files = [];
        for (let i = 0; i < this.files.length; ++i) {
            if (this.files[i].name !== name || this.files[i].logical_name !== logic_name) {
                new_files.push(this.files[i]);
            }
        }
        this.files = new_files;
    }

    delete_logical_name(logic_name) {
        let new_files = [];
        for (let i = 0; i < this.files.length; ++i) {
            if (this.files[i].logical_name !== logic_name) {
                new_files.push(this.files[i]);
            }
        }
        this.files = new_files;
    }

    get_normalized_project() {
        let libraries = [];

        for (let i = 0; i < this.files.length; i++) {
            const element_file = this.files[i];
            const logical_name = element_file.logical_name;
            const name = element_file.name;

            let library_is = false;
            //Search if the library exists
            for (let j = 0; j < libraries.length; j++) {
                const element_lib = libraries[j];
                if (logical_name === element_lib['name'] && name !== 'teroshdl_phantom_file') {
                    element_lib['files'].push(name);
                    library_is = true;
                    break;
                }
            }
            //Create library
            if (library_is === false && name === 'teroshdl_phantom_file') {
                let library = {
                    name: logical_name,
                    files: []
                };
                libraries.push(library);
            } else if (library_is === false && name !== 'teroshdl_phantom_file') {
                let library = {
                    name: logical_name,
                    files: [name]
                };
                libraries.push(library);
            }
        }

        let normalized_prj = {
            name: this.name,
            libraries: libraries
        };
        return normalized_prj;
    }

    check_if_files_exist() {
        let files = this.get_sources_as_array();
        let error_files = [];
        for (let i = 0; i < files.length; i++) {
            const element = files[i];
            if (!fs.existsSync(element) && element !== '') {
                error_files.push(element);
            }
        }
        let return_error = {
            files: error_files,
            error: false
        };

        if (error_files.length > 0) {
            return_error.error = true;
        }
        return return_error;
    }

    async get_dependency_tree(pypath) {
        let project = this.get_json_prj();
        let dependency_inst = new dependency.Dependency_graph();
        let dependency_tree = await dependency_inst.get_dependency_tree(project, pypath);
        return dependency_tree;
    }

    async get_compile_order(pypath) {
        let project = this.get_json_prj();
        let dependency_inst = new dependency.Dependency_graph();
        let compile_order = await dependency_inst.get_compile_order(project, pypath);
        return compile_order;
    }

}

class Edam_file {
    constructor(name, is_include_file = false, include_path = '', logic_name = '') {
        this.name = name;
        this.file_type = this.get_file_type(name);
        this.is_include_file = is_include_file;
        this.include_path = include_path;
        this.logical_name = logic_name;
    }

    get_info(relative_path) {
        let file_path = this.name;
        const os = require('os');
        if (os.platform === "win32") {
            file_path = file_path.replace(/\\/g, '\\\\');
        }

        if (relative_path !== undefined && relative_path !== '') {
            file_path = path_lib.relative(relative_path, file_path);
        }

        let info = {
            'name': file_path,
            'file_type': this.file_type,
            'is_include_file': this.is_include_file
        };
        info['include_path'] = this.include_path;
        info['logical_name'] = this.logical_name;
        return info;
    }

    get_file_type(file) {
        const path = require('path');
        let extension = path.extname(file).toLowerCase();

        let file_type = '';
        let lang = utils.get_lang_from_extension(extension);

        if (lang === 'vhdl') {
            file_type = 'vhdlSource-2008';
        } else if (lang === 'verilog') {
            file_type = 'verilogSource-2005';
        } else if (lang === 'systemverilog') {
            file_type = 'systemVerilogSource';
        } else if (extension === '.c') {
            file_type = 'cSource';
        } else if (extension === '.cpp') {
            file_type = 'cppSource';
        } else if (extension === '.vbl') {
            file_type = 'veribleLintRules';
        } else if (extension === '.tcl') {
            file_type = 'tclSource';
        } else if (extension === '.py') {
            file_type = 'python';
        } else if (extension === '.xdc') {
            file_type = 'xdc';
        } else if (extension === '.xci') {
            file_type = 'xci';
        } else if (extension === '.sby') {
            file_type = 'sbyConfigTemplate';
        } else {
            file_type = extension.substring(1).toLocaleUpperCase();
        }
        return file_type;
    }
}

module.exports = {
    Edam_project: Edam_project,
    json_edam_to_yml_edam: json_edam_to_yml_edam,
    yml_edam_str_to_json_edam: yml_edam_str_to_json_edam
};