// Copyright 2020 Teros Technology
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

const fs = require('fs');
const Base_formatter = require('./base_formatter');

class Vsg extends Base_formatter {
    constructor() {
        super();
    }

    //Options: {custom_path:"/path/to/bin, custom_bin:"bin", file_rules:"path/to/rules.json"}
    async format_from_code(code, options) {
        let temp_file = await this._create_temp_file_of_code(code);
        let formatted_code = await this._format(temp_file, options);
        return formatted_code;
    }

    async _format(file, options) {
        let synt = "";
        if (options !== undefined && options.file_rules !== undefined) {
            synt = `vsg --fix -c ${options.file_rules} -f `;
        } else {
            synt = `vsg --fix -f `;
        }
        await this._exec_formatter(file, synt, synt, options);
        let formatted_code = fs.readFileSync(file, 'utf8');
        return formatted_code;
    }
}

module.exports = {
    Vsg: Vsg
};