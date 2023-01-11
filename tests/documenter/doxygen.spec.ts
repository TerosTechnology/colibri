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

