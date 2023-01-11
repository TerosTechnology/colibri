import * as fs from 'fs';
import * as paht_lib from 'path';
import * as common_hdl from "../../src/parser/common";
import { HDL_LANG } from "../../src/common/general";
import * as diagram from "../../src/documenter/diagram";
import { equal } from "assert";

const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'diagram', 'out');
fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });

const port_input: common_hdl.Port_hdl = {
    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "input_0",
        description: ""
    },
    direction: "input",
    default_value: "8",
    type: "std_logic_vector(1 downto 0)",
    subtype: ""
};

const port_output: common_hdl.Port_hdl = {
    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "output_0",
        description: ""
    },
    direction: "output",
    default_value: "11",
    type: "std_logic_vector(22 downto 0)",
    subtype: ""
};

const generic_0: common_hdl.Port_hdl = {
    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "generic_0",
        description: ""
    },
    direction: "",
    default_value: "8",
    type: "integer",
    subtype: ""
};

const generic_1: common_hdl.Port_hdl = {
    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "generic_1",
        description: ""
    },
    direction: "",
    default_value: "8",
    type: "std_logic",
    subtype: ""
};

function check_test(test_index: number) {
    const expected_path = paht_lib.join(__dirname, 'diagram', 'expected', `output_${test_index}.svg`);
    const actual_path = paht_lib.join(__dirname, 'diagram', 'out', `output_${test_index}.svg`);

    const expected = fs.readFileSync(expected_path);
    const actual = fs.readFileSync(actual_path);

    const check = expected.equals(actual);

    equal(true, check);
}

describe('Check diagram generator', function () {

    it(`With ports and generics and color`, async function () {
        const test_index = 0;
        const OPT: diagram.Diagram_options = {
            blackandwhite: false
        };

        const hdl_element = new common_hdl.Hdl_element(HDL_LANG.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
        // Ports
        hdl_element.add_port(port_input);
        hdl_element.add_port(port_output);
        // Generics
        hdl_element.add_generic(generic_0);
        hdl_element.add_generic(generic_1);

        const svg_diagram = diagram.diagram_generator(hdl_element, OPT);

        const file_o = paht_lib.join(C_OUTPUT_BASE_PATH, `output_${test_index}.svg`);
        fs.writeFileSync(file_o, svg_diagram);

        check_test(test_index);
    });

    it(`Only ports and color`, async function () {
        const test_index = 1;
        const OPT: diagram.Diagram_options = {
            blackandwhite: false
        };

        const hdl_element = new common_hdl.Hdl_element(HDL_LANG.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
        // Ports
        hdl_element.add_port(port_input);
        hdl_element.add_port(port_output);

        const svg_diagram = diagram.diagram_generator(hdl_element, OPT);

        const file_o = paht_lib.join(C_OUTPUT_BASE_PATH, `output_${test_index}.svg`);
        fs.writeFileSync(file_o, svg_diagram);

        check_test(test_index);
    });

    it(`Only generics and color`, async function () {
        const test_index = 2;
        const OPT: diagram.Diagram_options = {
            blackandwhite: false
        };

        const hdl_element = new common_hdl.Hdl_element(HDL_LANG.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
        // Generics
        hdl_element.add_generic(generic_0);
        hdl_element.add_generic(generic_1);

        const svg_diagram = diagram.diagram_generator(hdl_element, OPT);

        const file_o = paht_lib.join(C_OUTPUT_BASE_PATH, `output_${test_index}.svg`);
        fs.writeFileSync(file_o, svg_diagram);

        check_test(test_index);
    });

    it(`Empty and color`, async function () {
        const test_index = 3;
        const OPT: diagram.Diagram_options = {
            blackandwhite: false
        };

        const hdl_element = new common_hdl.Hdl_element(HDL_LANG.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);

        const svg_diagram = diagram.diagram_generator(hdl_element, OPT);

        const file_o = paht_lib.join(C_OUTPUT_BASE_PATH, `output_${test_index}.svg`);
        fs.writeFileSync(file_o, svg_diagram);

        check_test(test_index);
    });

    it(`With ports and generics and black and white`, async function () {
        const test_index = 4;
        const OPT: diagram.Diagram_options = {
            blackandwhite: true
        };

        const hdl_element = new common_hdl.Hdl_element(HDL_LANG.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
        // Ports
        hdl_element.add_port(port_input);
        hdl_element.add_port(port_output);
        // Generics
        hdl_element.add_generic(generic_0);
        hdl_element.add_generic(generic_1);

        const svg_diagram = diagram.diagram_generator(hdl_element, OPT);

        const file_o = paht_lib.join(C_OUTPUT_BASE_PATH, `output_${test_index}.svg`);
        fs.writeFileSync(file_o, svg_diagram);

        check_test(test_index);
    });
});


