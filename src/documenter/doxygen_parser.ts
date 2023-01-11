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

import * as common_hdl from "../parser/common";

export const DOXYGEN_FIELD_ARRAY = ['author', 'version', 'project', 'copyright', 'brief', 'details',
    'custom_section_begin', 'custom_section_end'];

export type Doxygen_element = {
    field: string;
    description: string;
}

export function parse_doxygen(text: string) {
    // Always remove carriage return
    text = text.replace(/\r/gm, "");

    DOXYGEN_FIELD_ARRAY.forEach(function (field: string) {
        text = text.replace(`@${field}`, `\n@${field}`);
    });

    let doxygen_element_list: Doxygen_element[] = [];
    DOXYGEN_FIELD_ARRAY.forEach(function (field: string) {
        const result = parse_element(field, text);
        doxygen_element_list = doxygen_element_list.concat(result.element_list);
        text = result.text;
    });
    return { 'text': text, 'element_list': doxygen_element_list };
}

export function parse_virtualbus_init(text: string) {
    const result = {
        is_in: false,
        name: '',
        direction: 'in',
        keepports: false,
        description: ''
    };

    text = text.trim();

    //Keep ports
    const keep_ports_element = is_keeports(text);
    let corpus = text;
    if (keep_ports_element.is_in === true) {
        result.keepports = true;
        corpus = keep_ports_element.text;
    }

    //Port name
    const virtual_port_element = parse_element('virtualbus', corpus);
    if (virtual_port_element.element_list.length === 0) {
        return result;
    }
    corpus = virtual_port_element.element_list[0].description.trim();
    let element_0 = get_first_element(corpus);
    result.name = element_0.name;
    result.is_in = true;
    corpus = element_0.text.trim();

    // Direction
    const direction_port_element = parse_element('dir', corpus);
    if (direction_port_element.element_list.length === 0) {
        result.description = corpus.trim();
        return result;
    }
    corpus = direction_port_element.element_list[0].description.trim();
    element_0 = get_first_element(corpus);
    result.direction = element_0.name;
    result.description = element_0.text.trim();
    return result;
}

function is_keeports(text: string) {
    const regex = /@keepports/gms;
    const element_parser = text.match(regex);
    const result = {
        text: text,
        is_in: false
    };
    if (element_parser !== null) {
        result.is_in = true;
        result.text = text.replace(regex, '');
    }
    return result;
}

function get_first_element(text: string) {
    let corpus_split = text.split(' ');
    const name = corpus_split[0];
    corpus_split = corpus_split.splice(1);
    const corpus_serial = corpus_split.join(' ');
    return { name: name, text: corpus_serial };
}

export function parse_virtualbus_end(text: string) {
    const result = {
        is_in: false,
        text: ""
    };
    const regex = /@end/gms;
    const element = text.match(regex);
    if (element !== null) {
        result.is_in = true;
        result.text = text.replace(regex, '');
    }
    return result;
}

export function get_virtual_bus(port_list: common_hdl.Port_hdl[]) {
    enum state_e {
        INIT = 0,
        WAIT_FOR_BUS = 1,
        WAIT_FOR_END = 2,
        ERROR = 2
    }

    const normal_port_list: common_hdl.Port_hdl[] = [];
    const virtual_bus_list: common_hdl.Virtual_bus_hdl[] = [];

    let state: state_e = state_e.WAIT_FOR_BUS;

    let virtual_bus: common_hdl.Virtual_bus_hdl;
    let double_check = false;

    port_list.forEach(port_i => {
        const port_description = port_i.info.description.trim();

        // Search virtual bus
        if (state === state_e.WAIT_FOR_BUS) {
            const virtual_port = parse_virtualbus_init(port_description);
            if (virtual_port.is_in === true) {
                // Create virtual bus
                const virtual_port_instance: common_hdl.Virtual_bus_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.VIRTUAL_BUS,
                    info: {
                        position: {
                            line: 0,
                            column: 0
                        },
                        name: virtual_port.name,
                        description: virtual_port.description
                    },
                    direction: virtual_port.direction,
                    keepports: virtual_port.keepports,
                    port_list: [],
                    type: "virtual_bus"
                };
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: ""
                    },
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_port_instance.port_list.push(clean_port);
                virtual_bus = virtual_port_instance;
                state = state_e.WAIT_FOR_END;
            }
            else {
                normal_port_list.push(port_i);
            }
        }
        // Search end of virtual bus
        else if (state === state_e.WAIT_FOR_END) {
            const virtual_port_end = parse_virtualbus_end(port_description);
            const virtual_port_init = parse_virtualbus_init(port_description);

            double_check = false;
            // New virtual bus
            if (virtual_port_init.is_in === true) {
                state = state_e.WAIT_FOR_BUS;
                virtual_bus_list.push(virtual_bus);
                double_check = true;
            }
            else if (virtual_port_end.is_in === true) {
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: virtual_port_end.text
                    },
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_bus.port_list.push(clean_port);
                virtual_bus_list.push(virtual_bus);
                state = state_e.WAIT_FOR_BUS;
            }
            else {
                virtual_bus.port_list.push(port_i);
            }
        }

        if (double_check === true) {
            const virtual_port = parse_virtualbus_init(port_description);
            if (virtual_port.is_in === true) {
                // Create virtual bus
                const virtual_port_instance: common_hdl.Virtual_bus_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.VIRTUAL_BUS,
                    info: {
                        position: {
                            line: 0,
                            column: 0
                        },
                        name: virtual_port.name,
                        description: virtual_port.description
                    },
                    direction: virtual_port.direction,
                    keepports: virtual_port.keepports,
                    port_list: [],
                    type: "virtual_bus"
                };
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: ""
                    },
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_port_instance.port_list.push(clean_port);
                virtual_bus = virtual_port_instance;
                state = state_e.WAIT_FOR_END;
            }
            else {
                normal_port_list.push(port_i);
            }
        }
    });
    return { port_list: normal_port_list, v_port_list: virtual_bus_list };
}

function parse_element(field: string, text: string) {
    const regex_followed = new RegExp(`^s*[@]${field}\\s.*\n\n`, 'gms');
    const regex_not_followed = new RegExp(`^s*[@]${field}\\s.*`, 'gms');
    // const regex_replace = new RegExp(`^s*[@]${field}\\s`, '');

    const doxygen_element_list: Doxygen_element[] = [];

    let element_parser = text.match(regex_followed);
    if (element_parser === null) {
        element_parser = text.match(regex_not_followed);
    }
    if (element_parser !== null) {
        const stripped_element = element_parser[0].split(/\n[\s]*\n/gm);
        for (let index = 0; index < stripped_element.length; index++) {
            if (stripped_element[index] !== undefined && stripped_element[index].match(regex_not_followed) !== null) {
                // let name = stripped_element[index].replace(regex_replace, "");
                const description = stripped_element[index].replace(`@${field}`, "").trim();
                text = text.replace(stripped_element[index], "");

                const doxygen_element: Doxygen_element = {
                    field: "",
                    description: ""
                };

                doxygen_element.field = field;
                doxygen_element.description = description;
                doxygen_element_list.push(doxygen_element);
            }
        }
    }
    return { 'text': text, 'element_list': doxygen_element_list };
}