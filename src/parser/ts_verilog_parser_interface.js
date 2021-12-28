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

        let cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (generics_types.includes(cursor.nodeType) === true) {

                let items = [];
                let interface_name = '';

                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'interface_nonansi_header') {
                        interface_name = this.get_interface_name(cursor.currentNode());
                        comments = '';
                    } else if (cursor.nodeType === 'interface_item') {
                        last_element_position = cursor.startPosition.row;
                        
                        let new_interface_items = this.get_interface_items(cursor.currentNode(), general_comments);
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
                let items_other = [];
                for (const item of items) {
                    if (item.type === 'modport') {
                        items_modport.push(item);
                    }
                    else {
                        items_other.push(item); 
                    }
                }
        
                let interface_item = {
                    'name': interface_name,
                    'description': comments_description,
                    'modports': items_modport,
                    'others': items_other,
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

    get_interface_items(tree, general_comments) {
        let items = [];
        let child = this.search_multiple_in_tree(tree, 'non_port_interface_item');
        if (child.length !== 1) {
            return items;
        }
        
        let child_modport = this.search_multiple_in_tree(child[0], 'modport_declaration');
        let child_other = this.search_multiple_in_tree(child[0], 'interface_or_generate_item');

        if (child_modport.length === 1) {
            items = this.get_modport_interface_items(child_modport[0], general_comments);
        }
        else if (child_other.length === 1) {
            items = this.get_other_interface_items(child_other[0]);
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
            let child = data_declaration[0];
            let item_name = child.text.replace('logic', '').trim().replace(';', '');
            let item_names = item_name.split(',');
            for (let i = 0; i < item_names.length; i++) {
                const element = item_names[i];
                let start_line = child.startPosition.row;
                items.push({ 'name': element, 'type': 'other', 'description': '', 'start_line': start_line});
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