const showdown = require('showdown');
const utils = require('./utils');

class Documenter_interface {
    constructor(translator, type){
        this.translator = translator;
        this.type = type;
    }

    get_doc(tree) {
        let doc = '';
        let interfaces = tree.interface;
        for (let interface_inst of interfaces) {
            doc += this.get_interface(interface_inst);
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
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        // Title
        let doc_raw = `# Interface: ${interface_inst['name']}\n\n`;
        if (this.type === 'markdown') {
            doc = doc_raw;
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

        // Others
        doc += this.get_others(interface_inst['others']);

        // Modports
        doc += this.get_modports(interface_inst['modports']);

        return doc;
    }

    get_others(items) {
        const md = require('./markdownTable');
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        let doc_markdown = '';
        let doc_html = '';

        if (items.length === 0) {
            return '';
        }

        // Title
        let doc_raw = `## Others\n\n`;
        doc_markdown += doc_raw;
        doc_html += converter.makeHtml(doc_raw);

        // Modports
        let table = [];
        table.push([this.translator.get_str("Port name"), this.translator.get_str("Description")]);
        for (const item of items) {
            let item_name = item['name'];
            let item_description = item['description'];

            table.push([item_name, item_description]);
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