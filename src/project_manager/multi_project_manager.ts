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
import { Config_manager, merge_configs } from "../config/config_manager";
import { Project_manager } from "./project_manager";
import { t_test_declaration, t_test_result } from "./tool/common";
import { e_config } from "../config/config_declaration";

export class Multi_project_manager {
    private project_manager_list: Project_manager[] = [];
    private selected_project = "";
    private global_config: Config_manager;
    private name = "";

    constructor(name: string, global_config_sync_path: string) {
        this.name = name;
        this.global_config = new Config_manager(global_config_sync_path);
    }

    get_name(): string {
        return this.name;
    }

    get_projects(): Project_manager[] {
        return this.project_manager_list;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    public rename_project(prj_name: string, new_name: string) {
        // Check if project to reanme exists
        const exist_prj_0 = this.get_project_by_name(prj_name);
        if (exist_prj_0 === undefined) {
            return this.get_project_not_exist();
        }
        // Check if new name projec exists
        const exist_prj_1 = this.get_project_by_name(new_name);
        if (exist_prj_1 !== undefined) {
            return this.get_project_exist();
        }

        exist_prj_0.rename(new_name);
        return this.get_sucessful_result(undefined);
    }

    public create_project(prj_name: string) {
        const exist_prj = this.get_project_by_name(prj_name);
        if (exist_prj !== undefined) {
            return this.get_project_exist();
        }
        const prj = new Project_manager(prj_name);
        this.project_manager_list.push(prj);
        return this.get_sucessful_result(undefined);
    }

    public delete_project(prj_name: string): t_action_result {
        const new_project_manager_list: Project_manager[] = [];

        if (prj_name === this.selected_project) {
            this.selected_project = "";
        }

        let is_prj = false;
        for (let i = 0; i < this.project_manager_list.length; i++) {
            const element = this.project_manager_list[i];
            if (element.get_name() !== prj_name) {
                new_project_manager_list.push(element);
            }
            else {
                is_prj = true;
            }
        }
        this.project_manager_list = new_project_manager_list;
        if (is_prj === true) {
            return this.get_sucessful_result(undefined);
        }
        return this.get_project_not_exist();
    }

    public select_project(prj_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        this.selected_project = prj_name;
        return this.get_sucessful_result(undefined);
    }

    public get_project_by_name(name: string): Project_manager | undefined {
        let return_value: Project_manager | undefined = undefined;
        this.project_manager_list.forEach(project => {
            if (project.get_name() === name) {
                return_value = project;
            }
        });
        return return_value;
    }

    public get_select_project(): t_action_result {
        const prj = this.get_project_by_name(this.selected_project);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return this.get_sucessful_result(prj);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Hook
    ////////////////////////////////////////////////////////////////////////////
    public add_hook(prj_name: string, script: t_script, stage: e_script_stage)
        : t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.add_hook(script, stage);
    }

    public delete_hook(prj_name: string, script: t_script, stage: e_script_stage)
        : t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.delete_hook(script, stage);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Parameters
    ////////////////////////////////////////////////////////////////////////////
    add_parameter(prj_name: string, parameter: t_parameter): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.add_parameter(parameter);
    }

    delete_parameter(prj_name: string, parameter: t_parameter): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.delete_parameter(parameter);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    add_toplevel_path(prj_name: string, toplevel_path_inst: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.add_toplevel_path(toplevel_path_inst);
    }

    delete_toplevel_path(prj_name: string, toplevel_path_inst: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.delete_toplevel_path(toplevel_path_inst);
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    add_file(prj_name: string, file: t_file_reduced): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.add_file(file);
    }

    add_file_from_csv(prj_name: string, csv_path: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.add_file_from_csv(csv_path);
    }

    delete_file(prj_name: string, name: string, logical_name = "") {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.delete_file(name, logical_name);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(prj_name: string, python_path: string): Promise<t_action_result> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return await prj.get_dependency_graph(python_path);
    }
    async get_compile_order(prj_name: string, python_path: string): Promise<t_action_result> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return await prj.get_compile_order(python_path);
    }
    async get_dependency_tree(prj_name: string, python_path: string): Promise<t_action_result> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.get_dependency_tree(python_path);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public get_config_manager() {
        // Selected project config
        const selected_prj = this.get_select_project();
        let prj_config = undefined;
        if (selected_prj.successful === true) {
            prj_config = selected_prj.result.get_config_manager();
        }
        // Glogal config
        const global_config = this.global_config.get_config();
        // Merge configs
        const config_manager = new Config_manager();
        config_manager.set_config(merge_configs(global_config, prj_config));

        return config_manager;
    }

    public set_global_config(config: e_config) {
        this.global_config.set_config(config);
        return this.get_sucessful_result(undefined);
    }

    public set_global_config_from_json(config: any) {
        this.global_config.set_config_from_json(config);
        return this.get_sucessful_result(undefined);
    }

    public set_config(prj_name: string, config: e_config): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        prj.set_config(config);
        return this.get_sucessful_result(undefined);
    }

    public get_config(prj_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.get_config();
        return this.get_sucessful_result(result);
    }

    public get_config_global_config() {
        return this.global_config.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public run(prj_name: string, general_config: e_config | undefined, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: t_action_result) => void): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            callback([]);
            return this.get_project_not_exist();
        }
        const exec_i = prj.run(general_config, test_list, callback, callback_stream);
        return this.get_sucessful_result(exec_i);
    }
    public async get_test_list(prj_name: string, general_config: e_config): Promise<t_test_declaration[]> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return [];
        }
        return await prj.get_test_list(general_config);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    private get_project_not_exist(): t_action_result {
        const result: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Project doesn't exists"
        };
        return result;
    }

    private get_project_exist(): t_action_result {
        const result: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Project name exists"
        };
        return result;
    }

    private get_sucessful_result(result_i: any): t_action_result {
        const result: t_action_result = {
            result: result_i,
            successful: true,
            msg: ""
        };
        return result;
    }

    public check_if_file_in_project(prj_name: string, name: string, logical_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.check_if_file_in_project(name, logical_name);
        return this.get_sucessful_result(result);
    }

}
