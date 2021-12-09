// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
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

const SUPPORTED_LANGUAGES = ['english', 'russian'];

class Translator {

    constructor(language) {

        const fs = require('fs');
        const path_lib = require('path');

        let translation_path = path_lib.join(__dirname, 'translation.json');
        let rawdata = fs.readFileSync(translation_path);
        this.translation = JSON.parse(rawdata);


        if (SUPPORTED_LANGUAGES.includes(language) === false) {
            this.language = 'english';
        }
        else {
            this.language = language;
        }
    }

    set_language(language) {
        if (SUPPORTED_LANGUAGES.includes(language) === false) {
            this.language = 'english';
        }
        else {
            this.language = language;
        }
    }

    get_str(key) {
        let str_lang = 'ERROR_TRANSLATION';
        try {            
            str_lang = this.translation[key][this.language];
            if (str_lang === undefined) {
                str_lang = 'ERROR_TRANSLATION';
            }
        }
        catch (e) {
            console.log(e);
        }
        return str_lang;
    }
}


module.exports = {
    Translator: Translator
  };
  
