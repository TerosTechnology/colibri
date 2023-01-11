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

import { t_file_reduced, t_file, t_action_result } from "../common";
import * as file_utils from "../../utils/file_utils";
import * as hdl_utils from "../../utils/hdl_utils";
import * as general from "../../common/general";
import { Manager } from "./manager";

export class File_manager extends Manager<t_file_reduced, undefined, string, string> {
    private files: t_file[] = [];

    clear() {
        this.files = [];
    }

    get(): t_file[] {
        return this.files;
    }

    add(file: t_file_reduced): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(file.name, file.logical_name)) {
            result.successful = false;
            result.msg = "The file is duplicated";
            return result;
        }

        const complete_file: t_file = {
            name: file.name,
            file_type: this.get_file_type(file.name),
            is_include_file: file.is_include_file,
            include_path: file.include_path,
            logical_name: file.logical_name
        };

        this.files.push(complete_file);
        return result;
    }

    delete(name: string, logical_name = ""): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(name, logical_name) === false) {
            result.successful = false;
            result.msg = "Toplevel path doesn't exist";
            return result;
        }

        const new_files: t_file[] = [];
        this.files.forEach(file => {
            if (file.name !== name || file.logical_name !== logical_name) {
                new_files.push(file);
            }
        });
        this.files = new_files;
        return result;
    }

    private check_if_exists(name: string, logical_name = ""): boolean {
        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            if (file.name === name && file.logical_name === logical_name) {
                return true;
            }
        }
        return false;
    }

    private get_file_type(filepath: string) {
        const extension = file_utils.get_file_extension(filepath);
        let file_type = '';
        const hdl_lang = hdl_utils.get_lang_from_extension(extension);

        if (hdl_lang === general.HDL_LANG.VHDL) {
            file_type = 'vhdlSource-2008';
        } else if (hdl_lang === general.HDL_LANG.VERILOG) {
            file_type = 'verilogSource-2005';
        } else if (hdl_lang === general.HDL_LANG.SYSTEMVERILOG) {
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