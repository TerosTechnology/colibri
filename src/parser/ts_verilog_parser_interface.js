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

const ts_base_parser = require('./ts_base_parser');

class Parser_interface extends ts_base_parser.Ts_base_parser {
    constructor(comment_symbol) {
        super();
        this.comment_symbol = comment_symbol;
    }

    get_interfaces(tree, lines, general_comments) {
        let interfaces = [];
        let last_element_position = -1;
        let generics_types = ['interface_declaration'];
        let comments = '';
        let comments_description = '';
        let ansi_header = false;

        let cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (generics_types.includes(cursor.nodeType) === true) {

                let items = [];
                let parameters = [];
                let ports = [];
                let interface_name = '';

                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'interface_nonansi_header') {
                        interface_name = this.get_interface_name(cursor.currentNode());
                        comments = '';
                    } else if (cursor.nodeType === 'interface_ansi_header') {
                        ansi_header = true;
                        interface_name = this.get_interface_name_ansi(cursor.currentNode());
                        parameters = this.get_ansi_generics(cursor.currentNode(), lines, general_comments);
                        ports = this.get_ansi_ports(cursor.currentNode(), lines, general_comments);

                    } else if (cursor.nodeType === 'interface_item' || cursor.nodeType === 'non_port_interface_item') {
                        last_element_position = cursor.startPosition.row;
                        
                        let new_interface_items = this.get_interface_items(cursor.currentNode(),
                            general_comments, ansi_header);
                        new_interface_items = this.set_description_to_array(new_interface_items,
                            comments, general_comments);
                        items = items.concat(new_interface_items);

                        comments = '';
                    } else if (cursor.nodeType === 'comment') {
                        let comment_position = cursor.startPosition.row;
                        if (last_element_position !== comment_position) {
                            comments += this.get_comment_with_break(cursor.nodeText);
                        } else {
                            comments = '';
                        }
                    } else {
                        comments = '';
                    }
                }
                while (cursor.gotoNextSibling() !== false);
                cursor.gotoParent();

                let items_modport = [];
                let items_logic = [];
                let items_other = [];

                for (const item of items) {
                    if (item.type === 'modport') {
                        items_modport.push(item);
                    }
                    else if (item.type === 'other') {
                        items_other.push(item);
                    }
                    else {
                        items_logic.push(item); 
                    }
                }
        
                let interface_item = {
                    'lang': 'verilog',
                    'name': interface_name,
                    'description': comments_description,
                    'modports': items_modport,
                    'logics': items_logic,
                    'others': items_other,
                    'ports': ports,
                    'generics': parameters
                };

                interfaces.push(interface_item);
                comments_description = '';
            }
            else if (cursor.nodeType === 'comment') {
                comments_description += this.get_comment_with_break(cursor.nodeText);
            }
        }
        while (cursor.gotoNextSibling() !== false);

        return interfaces;
    }

    get_interface_name(tree) {
        let interface_name = '';
        let interface_name_search = this.search_multiple_in_tree(tree, 'interface_identifier');
        if (interface_name_search.length !== 0) {
            interface_name = interface_name_search[0].text;
        }
        return interface_name;
    }

    get_interface_name_ansi(tree) {
        let interface_name = '';
        let interface_name_search = this.search_multiple_in_tree(tree, 'interface_identifier');
        if (interface_name_search.length !== 0) {
            interface_name = interface_name_search[0].text;
        }
        return interface_name;
    }

    get_interface_items(tree, general_comments, ansi_header) {
        let child;
        let items = [];
        if (ansi_header == false) {
            child = this.search_multiple_in_tree(tree, 'non_port_interface_item');
            if (child.length !== 1) {
                return items;
            }
        }
        else {
            child = [tree];
        }
        
        let child_modport = this.search_multiple_in_tree(child[0], 'modport_declaration');
        let child_other = this.search_multiple_in_tree(child[0], 'interface_or_generate_item');

        if (child_modport.length === 1) {
            items = this.get_modport_interface_items(child_modport[0], general_comments);
        }
        else if (child_other.length === 1) {
            items = this.get_other_interface_items(child_other[0]);
            if (items.length === 0) {
                items = this.get_custom_interface_items(child_other[0]);
            }
        }
        else {
            return items;
        }

        return items;
    }

    get_other_interface_items(tree) {
        let items = [];
        let data_declaration = this.search_multiple_in_tree(tree, 'data_declaration');

        if (data_declaration.length === 1) {
            let item_name = this.search_multiple_in_tree(data_declaration[0], 'list_of_variable_decl_assignments');
            let item_type = this.search_multiple_in_tree(data_declaration[0], 'data_type_or_implicit1');
            if (item_name.length === 1 && item_type.length === 1) {
                let item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    let start_line = item_name[0].startPosition.row;
                    items.push({ 'name': name_inst, 'type': item_type[0].text, 'description': '', 'start_line': start_line});
                }
            }
            return items;
        }

        let net_declaration = this.search_multiple_in_tree(tree, 'net_declaration');
        if (net_declaration.length === 1) {
            let item_name = this.search_multiple_in_tree(net_declaration[0], 'list_of_net_decl_assignments');
            let item_type = this.search_multiple_in_tree(net_declaration[0], 'net_type_identifier');
            if (item_name.length === 1 && item_type.length === 1) {
                let item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    let start_line = item_name[0].startPosition.row;
                    items.push({ 'name': name_inst, 'type': item_type[0].text, 'description': '', 'start_line': start_line});
                }
            }
        }
        return items;
    }

    get_custom_interface_items(tree) {
        let items = [];
        let data_declaration = this.search_multiple_in_tree(tree, 'net_declaration');
        if (data_declaration.length === 1) {
            let type = this.search_multiple_in_tree(tree, 'net_type_identifier');
            let name = this.search_multiple_in_tree(tree, 'list_of_net_decl_assignments');
            if (type.length !== 1 || name.length !== 1) {
                return [];
            }

            let type_str = type[0].text;
            let item_name = name[0].text;
            let item_names = item_name.split(',');
            for (const element of item_names){
                let start_line = name[0].startPosition.row;
                items.push({ 'name': element, 'type': 'other', 'kind': type_str,'description': '', 'start_line': start_line});
            }
        }
        return items;
    }

    get_modport_interface_items(tree, general_comments) {
        let modport_identifier = '';
        let last_element_position = -1;
        let comments = '';

        let items = [];
        let modport_item = this.search_multiple_in_tree(tree, 'modport_item');
        if (modport_item.length !== 1) {
            return items;
        }
        let child = modport_item[0];

        let cursor = child.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === "modport_identifier") {
                modport_identifier = cursor.nodeText;
            } else if (cursor.nodeType === 'modport_ports_declaration') {
                let new_interface_items = this.get_morport_ports(cursor.currentNode());
                new_interface_items = this.set_description_to_array(new_interface_items,
                    comments, general_comments);
                
                
                items = items.concat(new_interface_items);
                
                comments = '';

            } else if (cursor.nodeType === 'comment') {
                let comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += this.get_comment_with_break(cursor.nodeText);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);

        let start_line = child.startPosition.row;
        let modport = {
            'name': modport_identifier.trim(),
            'type': 'modport',
            'description': '',
            'ports': items,
            'start_line': start_line
        };

        return [modport];
    }

    get_morport_ports(tree) {
        let items = [];
        let data_declaration = this.search_multiple_in_tree(tree, "modport_simple_ports_declaration");
        if (data_declaration.length === 1) {
            let child = data_declaration[0];

            let direction_item = this.search_multiple_in_tree(tree, "port_direction");
            let identifier_item = this.search_multiple_in_tree(tree, "modport_simple_port");

            if (direction_item.length === 1 && identifier_item.length === 1) {
                let item_name = identifier_item[0].text;
                let item_names = item_name.split(',');
                for (let i = 0; i < item_names.length; i++) {
                    const element = item_names[i];
                    let start_line = child.startPosition.row;
                    items.push({
                        'name': element, 'description': '', 'direction': direction_item[0].text,
                        'start_line': start_line});
                }
            }
            else {
                return items;
            }
        }
        return items;
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    // Extract to common base parser
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////


    getPortName(port, lines) {
        var arr = this.search_multiple_in_tree(port, 'list_of_port_identifiers');
        var port_name;
        if (arr.length === 0) {
            arr = this.search_multiple_in_tree(port, 'list_of_variable_identifiers');
        }
        if (arr.length === 0) {
            arr = this.search_multiple_in_tree(port, 'port_identifier');
        }
        for (var x = 0; x < arr.length; ++x) {
            if (x === 0) {
                port_name = this.extract_data(arr[x], lines);
            } else {
                port_name = port_name + ',' + this.extract_data(arr[x], lines);
            }
        }
        return port_name;
    }

    getPortNameAnsi(port, lines) {
        let arr = this.search_multiple_in_tree(port, 'port_identifier');
        if (arr.length === 0) {
            arr = this.search_multiple_in_tree(port, 'simple_identifier');
            let port_name = this.extract_data(arr[0], lines);
            return port_name;
        } else {
            let port_name = this.extract_data(arr[0], lines);
            let split_port_name = port_name.split(',');
            for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
        }
    }

    getPortType(port, lines) {
        var arr = this.search_multiple_in_tree(port, 'net_port_type1');
        if (arr[0] == null) {
            arr = this.search_multiple_in_tree(port, 'packed_dimension');
        }
        if (arr[0] == null) {
            return "";
        }
        let port_type = this.extract_data(arr[0], lines);
        return port_type;
    }

    getPortKind(port, lines) {
        var arr = this.search_multiple_in_tree(port, 'port_direction');
        if (arr[0] == null) {
            return;
        }
        var port_type = this.extract_data(arr[0], lines);
        return port_type;
    }

    add_port(element, key, name, direction, type, ansi, items, comments, lines) {
        let directionVar = undefined;
        let start_line = element.startPosition.row;
        var item = {};
        var inputs = [];
        var arr = this.search_multiple_in_tree(element, key);
        inputs = arr;
        for (var x = 0; x < inputs.length; ++x) {
            var port_name;
            switch (name) {
                case 'getPortName':
                    port_name = this.getPortName(inputs[x], lines);
                    break;
                case 'getPortNameAnsi':
                    port_name = this.getPortNameAnsi(inputs[x], lines);
                    break;
                default:
                    name = this.getPortName;
            }
            port_name = port_name.split(',');
            directionVar = this.getPortKind(inputs[x], lines);
            if (directionVar !== undefined) {
                this.last_direction = directionVar;
            }
            var typeVar;
            switch (type) {
                case 'getPortType':
                    typeVar = this.getPortType(inputs[x], lines);
                    break;
                default:
                    typeVar = this.getPortType(inputs[x], lines);
            }
            var port_ref = this.search_multiple_in_tree(element, 'port_reference');
            var comment = "";
            var comment_str = comments[inputs[x].startPosition.row];
            for (var i = 0; i < port_name.length; i++) {
                if (comment_str === undefined) {
                    for (var z = 0; z < port_ref.length; z++) {
                        var port_ref_name = this.extract_data(port_ref[z], lines);
                        if (port_ref_name === port_name[i].trim()) {
                            var pre_comment = comments[port_ref[z].startPosition.row];
                            if (pre_comment !== undefined) {
                                comment = this.get_comment_with_break(pre_comment);
                            }
                        }
                    }
                }
                let comment_check = this.get_comment_with_break(comment_str);
                if (comment_check !== '') {
                    comment = comment_check;
                }
                if (directionVar === undefined) {
                    directionVar = this.last_direction;
                }

                item = {
                    'name': port_name[i],
                    'direction': ((ansi === true) ? directionVar : direction),
                    'type': typeVar,
                    "default_value": "",
                    "description": comment,
                    "start_line": start_line
                };
                items.push(item);
            }
        }
        return items;
    }

    get_ports(tree, lines, comments) {
        var items = [];
        var element = tree;
        //Inputs
        items = this.add_port(element, 'input_declaration', 'getPortName',
            'input', 'getPortType', false, items, comments, lines);
        //Outputs
        items = this.add_port(element, 'output_declaration', 'getPortName',
            'output', 'getPortType', false, items, comments, lines);
        //ansi_port_declaration
        items = this.add_port(element, 'ansi_port_declaration', 'getPortNameAnsi',
            'getPortKind', 'getPortType', true, items, comments, lines);
        //inouts
        items = this.add_port(element, 'inout_declaration', 'getPortName', "inout",
            'getPortType', false, items, comments, lines);
        return items;
    }


    get_ansi_ports(p, lines, general_comments) {
        let last_comments = '';
        let last_element_position = -1;
        let ports_types = ['input_declaration', 'output_declaration', 'ansi_port_declaration',
            'inout_declaration'
        ];

        let ports = [];
        let comments = '';

        let ports_list = this.get_item_from_childs(p, 'list_of_port_declarations');
        if (ports_list === undefined) {
            return ports;
        }

        let cursor = ports_list.walk();
        cursor.gotoFirstChild();
        do {
            if (ports_types.includes(cursor.nodeType) === true) {
                if (last_element_position === cursor.startPosition.row) {
                    comments = last_comments;
                } else {
                    last_comments = comments;
                }
                last_element_position = cursor.startPosition.row;

                let new_ports = this.get_ports(cursor.currentNode(), lines, general_comments);
                new_ports = this.set_description_to_array(new_ports, comments, general_comments);
                ports = ports.concat(new_ports);
                comments = '';
            } else if (cursor.nodeType === 'comment') {
                let comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += this.get_comment_with_break(cursor.nodeText);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return ports;
    }

    get_ansi_generics(p, lines, general_comments) {
        let last_element_position = -1;
        let generics_types = ['parameter_port_declaration'];
        let last_comments = '';

        let generics = [];
        let comments = '';

        let generics_list = this.get_item_from_childs(p, 'parameter_port_list');
        if (generics_list === undefined) {
            return generics;
        }

        let cursor = generics_list.walk();
        cursor.gotoFirstChild();
        do {
            if (generics_types.includes(cursor.nodeType) === true) {
                if (last_element_position === cursor.startPosition.row) {
                    comments = last_comments;
                } else {
                    last_comments = comments;
                }
                last_element_position = cursor.startPosition.row;

                let new_generics = this.get_generics(cursor.currentNode(), lines, general_comments, 1);
                new_generics = this.set_description_to_array(new_generics, comments, general_comments);
                generics = generics.concat(new_generics);
                comments = '';
            } else if (cursor.nodeType === 'comment') {
                let comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += this.get_comment_with_break(cursor.nodeText);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return generics;
    }

    get_generics(tree, lines, comments, ansi) {
        let items = [];
        let inputs = [];
        let item = {};
        let element = tree;
        let arr = [];
        //Inputs
        if (ansi === 0) {
            arr = this.search_multiple_in_tree(element, 'parameter_declaration');
        } else {
            arr = this.search_multiple_in_tree(element, 'parameter_declaration');
        }

        if (arr.length === 0) {
            arr = this.search_multiple_in_tree(element, 'parameter_port_declaration');
        }

        inputs = arr;
        for (let x = 0; x < inputs.length; ++x) {
            let comment = "";
            let pre_comment = comments[inputs[x].startPosition.row];
            if (pre_comment !== undefined) {
                comment = this.get_comment_with_break(pre_comment);
            }
            item = {
                "name": this.get_generic_name(inputs[x], lines),
                "type": this.get_generic_kind(inputs[x], lines),
                "default_value": this.get_generic_default(inputs[x], lines),
                "description": comment
            };
            items.push(item);
        }
        return items;
    }

    get_generic_kind(port, lines) {
        let arr = this.search_multiple_in_tree(port, 'data_type_or_implicit1');
        if (arr.length === 0) {
            return "";
        } else {
            let port_name = this.extract_data(arr[0], lines);
            let split_port_name = port_name.split(',');
            for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
        }
    }

    get_generic_name(port, lines) {
        let arr = this.search_multiple_in_tree(port, 'parameter_identifier');
        if (arr.length === 1) {
            arr = this.search_multiple_in_tree(port, 'simple_identifier');
            let port_name = this.extract_data(arr[0], lines);
            return port_name;
        } else {
            let port_name = this.extract_data(arr[0], lines);
            let split_port_name = port_name.split(',');
            for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
        }
    }

    get_generic_default(input, lines) {
        var arr = this.search_multiple_in_tree(input, 'constant_param_expression');
        if (arr.length === 0) {
            var name = "undefined";
            return name;
        }
        var input_value = this.extract_data(arr[0], lines);
        return input_value;
    }


    extract_data(node, lines) {
        return lines[node.startPosition.row].substr(node.startPosition.column,
            node.endPosition.column - node.startPosition.column);
    }



    set_description_to_array(arr, txt, general_comments) {
        for (let i = 0; i < arr.length; ++i) {
            let comment_candidate = general_comments[arr[i].start_line];
            if (comment_candidate !== undefined) {
                let result = this.check_comment(comment_candidate);
                if (result.check === true) {
                    arr[i].description = result.comment;
                }
            }
            if (arr[i].description === '') {
                arr[i].description = txt;
            }
        }
        return arr;
    }

    check_comment(comment) {
        let check = false;
        let result = '';
        comment = comment.slice(2);
        if (this.comment_symbol === '') {
            result = comment.trim() + '\n';
            check = true;
        } else if (comment[0] === this.comment_symbol) {
            result = comment.slice(1).trim() + '\n';
            check = true;
        }
        return { check: check, comment: result };
    }
}

module.exports = {
    Parser_interface: Parser_interface
  };