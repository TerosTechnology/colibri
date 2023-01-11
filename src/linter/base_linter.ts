// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com ]
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

import { create_temp_file } from "../process/utils";
import { Process } from "../process/process";
import * as common from "./common";
import { get_os } from "../process/utils";
import { OS } from "../process/common";
import * as path_lib from "path";
import * as logger from "../logger/logger";

export abstract class Base_linter {
    abstract binary_linux: string;
    abstract binary_mac: string;
    abstract binary_windows: string;

    parse_output(_output: string, _file: string): common.l_error[] {
        const errors: common.l_error[] = [];
        return errors;
    }

    async lint_from_file(file: string, options: common.l_options) {
        const normalized_file = file.replace(/ /g, '\\ ');
        const errors = await this.lint(normalized_file, options);
        return errors;
    }

    async lint_from_code(code: string, options: common.l_options) {
        const temp_file = await create_temp_file(code);
        const errors = await this.lint(temp_file, options);
        return errors;
    }

    get_binary(): string {
        const os_i = get_os();
        if (os_i === OS.LINUX) {
            return this.binary_linux;
        }
        else if (os_i === OS.WINDOWS) {
            return this.binary_windows;
        }
        else {
            return this.binary_mac;
        }
    }

    get_command(file: string, options: common.l_options) {
        const binary = this.get_binary();
        let complete_path = '';
        if (options.path === '') {
            complete_path = binary;
        }
        else {
            complete_path = path_lib.join(options.path, binary);
        }

        const command = `${complete_path} ${options.argument} "${file}"`;
        return command;
    }

    async exec_linter(file: string, options: common.l_options) {
        this.delete_previus_lint();
        const command = this.get_command(file, options);

        const msg = `Linting with command: ${command} `;
        // eslint-disable-next-line no-console
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);

        const P = new Process();
        const result = await P.exec_wait(command);

        this.delete_previus_lint();
        return result;
    }

    abstract lint(file: string, options: common.l_options): Promise<common.l_error[]>;
    abstract delete_previus_lint(): void;
}

