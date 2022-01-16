const showdown = require('showdown');
const utils = require('./utils');

class Documenter_interface {
    constructor(translator, type){
        this.translator = translator;
        this.type = type;
    }

    get_doc(tree, filename) {
        let doc = '';
        let interfaces = tree.interface;
        let doc_raw = '';
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        // Header
        if (filename !== '') {
            doc_raw = `- **${this.translator.get_str('File')}**: ` + filename + '\n';
            if (this.type === 'markdown') {
                doc += doc_raw;
            }
            else {
                doc += converter.makeHtml(doc_raw);
            }
        }

        for (let interface_inst of interfaces) {
            doc += this.get_interface(interface_inst, filename);
        }
        return doc;
    }

    normalize_description(description) {
        let description_norm = utils.remove_description_first_space(description).trim();
        description_norm = utils.normalize_description(description_norm);
        return description_norm;
    }

    get_interface(interface_inst) {
        let doc = '';
        let doc_raw = '';

        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        // Title
        doc_raw = `# ${this.translator.get_str('Interface')}: ${interface_inst['name']}\n\n`;
        if (this.type === 'markdown') {
            doc += doc_raw;
        }
        else {
            doc += converter.makeHtml(doc_raw);
        }

        // Description
        let description = this.normalize_description(interface_inst['description']);
        doc_raw = `${description}\n\n`;
        if (this.type === 'markdown') {
            doc = doc_raw;
        }
        else {
            doc += converter.makeHtml(doc_raw);
        }

        // Ports
        doc += this.get_ports(interface_inst['ports']);

        // Parameters
        doc += this.get_parameters(interface_inst['generics']);

        // Logics
        doc += this.get_logics(interface_inst['logics']);

        // Modports
        doc += this.get_modports(interface_inst['modports']);

        // Others
        doc += this.get_others(interface_inst['others']);

        return doc;
    }


    get_table_with_title(items, title, header, keys) {
        const md = require('./markdownTable');
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        let doc_markdown = '';
        let doc_html = '';

        if (items.length === 0) {
            return '';
        }

        // Title
        let doc_raw = `## ${this.translator.get_str(title)}\n\n`;
        doc_markdown += doc_raw;
        doc_html += converter.makeHtml(doc_raw);

        // Parameters
        let table = [];
        table.push(header);

        for (const item of items) {
            let value_to_table = [];
            for (const key of keys) {
                value_to_table.push(item[key]);
            }

            table.push(value_to_table);
            doc_raw = md(table) + '\n';

        }
        doc_markdown += doc_raw;
        doc_html += converter.makeHtml(doc_raw);
        if (this.type === 'markdown') {
            return doc_markdown;
        }
        else {
            return doc_html;
        }    
    }


    get_parameters(items) {
        let title = "Parameters";

        let header = [
            this.translator.get_str("Name"),
            this.translator.get_str("Default value"),
            this.translator.get_str("Description")
        ];

        let keys = ['name', 'default_value', 'description'];

        return this.get_table_with_title(items, title, header, keys);
    }

    get_ports(items) {
        let title = "Ports";

        let header = [
            this.translator.get_str("Port name"),
            this.translator.get_str("Direction"),
            this.translator.get_str("Type"),
            this.translator.get_str("Description")
        ];

        let keys = ['name', 'direction', 'type', 'description'];

        return this.get_table_with_title(items, title, header, keys);
    }

    get_logics(items) {
        let title = "Logics";

        let header = [
            this.translator.get_str("Name"),
            this.translator.get_str("Description")
        ];

        let keys = ['name', 'description'];

        return this.get_table_with_title(items, title, header, keys);
    }

    get_others(items) {
        let title = "Others";

        let header = [
            this.translator.get_str("Name"),
            this.translator.get_str("Type"),
            this.translator.get_str("Description")
        ];

        let keys = ['name', 'kind', 'description'];

        return this.get_table_with_title(items, title, header, keys);
    }

    get_modports(modports) {
        const md = require('./markdownTable');
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        let doc_markdown = '';
        let doc_html = '';

        if (modports.length === 0) {
            return '';
        }

        // Title
        let doc_raw = `## Modports\n\n`;
        doc_markdown += doc_raw;
        doc_html += converter.makeHtml(doc_raw);

        // Modports
        for (const modport of modports) {
            // Name
            doc_raw = `- ${this.translator.get_str("Name")}: **${modport['name']}**\n\n`;
            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);

            // Description
            let description = this.normalize_description(modport['description']);
            doc_raw = `${description}\n\n`;
            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);

            //Table
            let modport_items = modport['ports'];
            let table = [];
            table.push([this.translator.get_str("Port name"), this.translator.get_str("Direction"),
                this.translator.get_str("Description")]);
            for (const modport_item of modport_items) {
                const modport_item_name = modport_item['name'];
                const modport_item_direction = modport_item['direction'];
                const modport_description = modport_item['description'];

                table.push([modport_item_name, modport_item_direction, modport_description]);
            }
            doc_raw = md(table) + '\n';

            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);
        }
        if (this.type === 'markdown') {
            return doc_markdown;
        }
        else {
            return doc_html;
        }        
    }
}

module.exports = {
    Documenter_interface: Documenter_interface
};