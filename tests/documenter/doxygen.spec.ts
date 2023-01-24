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

import { equal } from "assert";
import { DOXYGEN_FIELD_ARRAY, parse_doxygen } from "../../src/documenter/doxygen_parser";

type Tester_t = {
    input: string;
    output: string;
    field: string;
}

enum Test_mode {
    SINGLE_LINE,
    MULTI_LINE
}

function get_test_array(test_mode: Test_mode) {
    // Test single line

    const tester_array: Tester_t[] = [];

    let test_input_cnt = "";
    if (test_mode === Test_mode.SINGLE_LINE) {
        test_input_cnt = "En un lugar de la mancha de cuyo lugar no quiero acordarme...\n";
    }
    else if (test_mode === Test_mode.MULTI_LINE) {
        test_input_cnt += 'En un lugar de la mancha de cuyo lugar no quiero acordarme \
\nno ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, \
\nadarga antigua, rocín flaco y galgo corredor.';
    }

    DOXYGEN_FIELD_ARRAY.forEach(function (element: string) {
        const test_input = `@${element} ${test_input_cnt}`;
        const tst = { input: test_input, output: test_input_cnt.trim(), field: element };
        tester_array.push(tst);
    });
    return tester_array;
}


describe('Test Doxygen elements single line and only 1 element in the description.', function () {
    const test_vector = get_test_array(Test_mode.SINGLE_LINE);
    test_vector.forEach(function (element: Tester_t) {
        it(`Testing ${element.field}`, function () {
            const result = parse_doxygen(element.input);
            equal(result.element_list[0].description, element.output);
        });
    });
});

describe('Test Doxygen elements multi line and only 1 element in the description.', function () {
    const test_vector = get_test_array(Test_mode.MULTI_LINE);
    test_vector.forEach(function (element: Tester_t) {
        it(`Testing ${element.field}`, function () {
            const result = parse_doxygen(element.input);
            equal(result.element_list[0].description, element.output);
        });
    });
});

