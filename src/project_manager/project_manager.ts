// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import { t_file_reduced, t_script, t_parameter, e_script_stage, t_action_result, } from "./common";
import * as  manager_file from "./list_manager/file";
import * as  manager_hook from "./list_manager/hook";
import * as  manager_parameter from "./list_manager/parameter";
import * as  manager_toplevel_path from "./list_manager/toplevel_path";
import * as  manager_dependency from "./dependency/dependency";
import { Tool_manager } from "./tool/tools_manager";
import { t_test_declaration, t_test_result } from "./tool/common";
import { t_project_definition } from "./project_definition";
import * as file_utils from "../utils/file_utils";
import { Config_manager, merge_configs } from "../config/config_manager";
import { e_config } from "../config/config_declaration";

export class Project_manager {
    /**  Name of the project */
    private name: string;
    /** Contains all the HDL source files, constraint files, vendor IP description files, 
     * memory initialization files etc. for the project. */
    private files = new manager_file.File_manager();
    /** A dictionary of extra commands to execute at various stages of the project build/run. */
    private hooks = new manager_hook.Hook_manager();
    /** Specifies build- and run-time parameters, such as plusargs, VHDL generics, Verilog defines etc. */
    private parameters = new manager_parameter.Parameter_manager();
    /** Toplevel path(s) for the project. */
    private toplevel_path = new manager_toplevel_path.Toplevel_path_manager();
    /** Config manager. */
    private config_manager = new Config_manager();
    private tools_manager = new Tool_manager(undefined);

    constructor(name: string) {
        this.name = name;
    }

    get_name() {
        return this.name;
    }

    rename(name: string) {
        this.name = name;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    // public save_definition() {
    //     const definition = this.get_project_definition(undefined);
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Hook
    ////////////////////////////////////////////////////////////////////////////
    public add_hook(script: t_script, stage: e_script_stage)
        : t_action_result {
        return this.hooks.add(script, stage);
    }

    public delete_hook(script: t_script, stage: e_script_stage)
        : t_action_result {
        return this.hooks.delete(script, stage);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Parameters
    ////////////////////////////////////////////////////////////////////////////
    add_parameter(parameter: t_parameter): t_action_result {
        return this.parameters.add(parameter);
    }

    delete_parameter(parameter: t_parameter): t_action_result {
        return this.parameters.delete(parameter);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    add_toplevel_path(toplevel_path_inst: string): t_action_result {
        this.toplevel_path.clear();
        return this.toplevel_path.add(toplevel_path_inst);
    }

    delete_toplevel_path(toplevel_path_inst: string): t_action_result {
        return this.toplevel_path.delete(toplevel_path_inst);
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    add_file_from_csv(csv_path: string): t_action_result {
        const csv_content = file_utils.read_file_sync(csv_path);
        const file_list_array = csv_content.split('\n');
        for (let i = 0; i < file_list_array.length; ++i) {
            const element = file_list_array[i].trim();
            if (element !== '') {
                try {
                    let proc_error = false;
                    let lib_inst = "";
                    let file_inst = "";
                    const element_split = element.split(',');
                    if (element_split.length === 1) {
                        file_inst = element.split(',')[0].trim();
                    }
                    else if (element_split.length === 2) {
                        lib_inst = element.split(',')[0].trim();
                        file_inst = element.split(',')[1].trim();
                    }
                    else {
                        proc_error = true;
                    }

                    if (proc_error === false) {
                        if (lib_inst === "") {
                            lib_inst = "";
                        }
                        const dirname_csv = file_utils.get_directory(file_inst);
                        const complete_file_path = file_utils.get_absolute_path(dirname_csv, file_inst);

                        const file_edam: t_file_reduced = {
                            name: complete_file_path,
                            is_include_file: false,
                            include_path: "",
                            logical_name: lib_inst
                        };
                        this.add_file(file_edam);
                    }
                }
                catch (e) {
                    const result: t_action_result = {
                        result: undefined,
                        successful: false,
                        msg: "Error processing CSV."
                    };
                    return result;
                }
            }
        }
        const result: t_action_result = {
            result: undefined,
            successful: true,
            msg: ""
        };
        return result;
    }

    add_file(file: t_file_reduced): t_action_result {
        return this.files.add(file);
    }

    delete_file(name: string, logical_name = "") {
        return this.files.delete(name, logical_name);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = m_dependency.get_dependency_graph_svg(this.files.get(), python_path);
        return result;
    }
    async get_compile_order(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = m_dependency.get_compile_order(this.files.get(), python_path);
        return result;
    }
    async get_dependency_tree(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = m_dependency.get_dependency_tree(this.files.get(), python_path);
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public set_config(new_config: e_config) {
        this.config_manager.set_config(new_config);
    }
    public get_config(): e_config {
        return this.config_manager.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public get_project_definition(config_manager: Config_manager | undefined = undefined): t_project_definition {
        let current_config_manager = config_manager;
        if (current_config_manager === undefined) {
            current_config_manager = this.config_manager;
        }
        const prj_definition: t_project_definition = {
            name: this.name,
            file_manager: this.files,
            hook_manager: this.hooks,
            parameter_manager: this.parameters,
            toplevel_path_manager: this.toplevel_path,
            config_manager: current_config_manager
        };
        return prj_definition;
    }
    public check_if_file_in_project(name: string, logical_name: string): boolean {
        const file_list = this.files.get();
        let return_value = false;
        file_list.forEach(file_inst => {
            if (file_inst.name === name && file_inst.logical_name === logical_name) {
                return_value = true;
            }
        });
        return return_value;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public run(general_config: e_config | undefined, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): any {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return this.tools_manager.run(this.get_project_definition(n_config_manager),
            test_list, callback, callback_stream);
    }

    public async get_test_list(general_config: e_config | undefined = undefined): Promise<t_test_declaration[]> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return await this.tools_manager.get_test_list(this.get_project_definition(n_config_manager));
    }
}





