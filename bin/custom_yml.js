// Copyright 2021 Teros Technology
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
/* eslint-disable no-console */

let colibri = require('../src/main.js');
const yaml = require('js-yaml');
const fs = require('fs');
const path_lib = require('path');


class Custom_yml{
  constructor(doc_options){
    this.doc_options = doc_options;
  }

  async gen_doc(options){
    let srsfile = options.input;
    this.doc_options = options;
    try {
      const doc = yaml.load(fs.readFileSync(srsfile, 'utf8'));
      for (const x in doc) {
        if (x === 'library'){
          await this.doc_library(doc[x], srsfile);
        }
        else if(x === 'ip'){
          await this.doc_ip(doc[x], srsfile);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async doc_library(lib, srsfile){
    let name = lib.name;
    let ips = lib.ips;

    let ips_obj = [];

    let index_output_path = lib['readme-index-path'];
    let lib_output_path = lib['readme-ips-path'];
    let lib_output_from_readme_path = lib['readme-ips-from-readme-path'];

    let internal_ips = [];

    for (const x in ips) {
      const ip = ips[x];
      let source = ip.source;
      const custom_doc = ip.custom_doc;

      if (source !== undefined){
        source = path_lib.dirname(srsfile) + '/' + source;
        ip.source = source;

        if (ip.internal_ips !== undefined){
          internal_ips = ip.internal_ips;
        }
        let ip_obj = {
          'source':source,
          'internal_ips':internal_ips,
          'custom_doc':custom_doc
        };
        ips_obj.push(ip_obj);
      }
    }

    await this.generate_and_save_documentation(index_output_path, lib_output_path, lib_output_from_readme_path, ips, name);
  }


  async doc_ip(lib, srsfile){
    let name = lib.name;
    let source = lib.source;
    let custom_doc = lib.custom_doc;
    let internal_ips = lib.internal_ips;
    if (internal_ips === undefined){
      internal_ips = [];
    }

    let ip_obj = {
      'source':source,
      'internal_ips':internal_ips,
      'custom_doc':custom_doc
    };

    let index_output_path = lib['readme-index-path'];
    let lib_output_path = lib['readme-ips-path'];
    let lib_output_from_readme_path = lib['readme-ips-from-readme-path'];

    await this.generate_and_save_documentation_ip(index_output_path, lib_output_path, lib_output_from_readme_path, 
      ip_obj, name);
  }


  async generate_and_save_documentation(index_output_path, lib_output_path, lib_output_from_readme_path, ips, name) {
    const path_lib = require('path');

    let main_doc = "# " + name + "\n\n";

    for (let i = 0; i < ips.length; ++i) {
      const source = ips[i].source;
      const internal_ips = ips[i].internal_ips;
      const ip_name = ips[i].name;
      const filename = path_lib.basename(source, path_lib.extname(source));

      if (lib_output_from_readme_path !== undefined){
        main_doc += "- [" + ip_name + "]( " + lib_output_from_readme_path + path_lib.sep + filename + ".md)\n";
      }
      else{
        main_doc += "- [" + ip_name + "](./" + filename + ".md)\n";
      }
      let internal_ips_section = '';
      if (internal_ips !== undefined && internal_ips.length !== 0){
        internal_ips_section = await this.save_internal_ips(lib_output_path, internal_ips);
      }
      if (ips[i].custom_doc !== true){
        await this.save_md_ip(lib_output_path, source, internal_ips_section);
      }
    }
    fs.writeFileSync(index_output_path + '/README.md', main_doc);
  }


  async generate_and_save_documentation_ip(index_output_path, lib_output_path, 
    lib_output_from_readme_path, ip) {
    const internal_ips = ip.internal_ips;
    const source = ip.source;

    let internal_ips_section = '';
    if (internal_ips !== undefined && internal_ips.length !== 0){
      internal_ips_section = await this.save_internal_ips(lib_output_path, internal_ips, lib_output_from_readme_path);
    }
    if (ip.custom_doc !== true){
      await this.save_md_ip(index_output_path, source, internal_ips_section, lib_output_path, 'README', 
        lib_output_from_readme_path);  
    }
  }

  async save_internal_ips(output_path, internal_ips, lib_output_from_readme_path){
    const path_lib = require('path');
    let main_doc = "## Intenal IPs\n";

    for (let i = 0; i < internal_ips.length; ++i) {
      const source = internal_ips[i];
      let filename = path_lib.basename(source, path_lib.extname(source));
      let filename2 = path_lib.basename(source, path_lib.extname(source));
      if (lib_output_from_readme_path !== undefined){
        filename2 = lib_output_from_readme_path + path_lib.sep +  filename2;
        main_doc += "- [" + filename + "](./" + filename2 + ".md)\n";
      }
      else{
        main_doc += "- [" + filename + "](./" + filename2 + ".md)\n";
      }
      await this.save_md_ip(output_path, source, undefined, undefined);
    }
    return main_doc;
  }


  async save_md_ip(output_path, path, internal_ips_section, output_svg_path, readme_name, 
        lib_output_from_readme_path){
    const path_lib = require('path');

    let lang = "vhdl";
    let symbol = "!";

    let filename = path_lib.basename(path, path_lib.extname(path));
    if (path_lib.extname(path) === '.vhd' || path_lib.extname(path) === '.vho'
      || path_lib.extname(path) === '.vhdl') {
      lang = "vhdl";
      symbol = this.doc_options.symbol_vhdl;
    }
    else if (path_lib.extname(path) === '.v' || path_lib.extname(path) === '.vh'
      || path_lib.extname(path) === '.vl' || path_lib.extname(path) === '.sv'
      || path_lib.extname(path) === '.SV') {
      lang = "verilog";
      symbol = this.doc_options.symbol_verilog;
    }
    let custom_svg_path_in_readme = undefined;
    if (readme_name === 'README'){
      custom_svg_path_in_readme = lib_output_from_readme_path + '/README.svg';
    }

    let config = this.doc_options;
    config.custom_section = internal_ips_section;
    config.custom_svg_path = output_svg_path;
    config.custom_svg_path_in_readme = custom_svg_path_in_readme;

    let contents = fs.readFileSync(path, 'utf8');
    let doc_inst = new colibri.Documenter.Documenter(contents, lang, symbol);
    if (readme_name !== undefined){
      filename = readme_name;
    }
    this.configure_documenter(doc_inst);
    await doc_inst.save_markdown(contents, lang, config, output_path + path_lib.sep + filename + ".md");
  }

  configure_documenter(documenter){
    if (this.doc_options !== undefined){
      documenter.set_config(this.doc_options);
      return;
    }
    let global_config = {
      "dependency_graph": false,
      'fsm': true,
      'signals': 'none',
      'functions': 'none',
      'constants': 'none',
      'process': 'none',
      'symbol_vhdl': "!",
      'symbol_verilog': "!",
      'self_contained': false
    };
    documenter.set_config(global_config);
  }
}


module.exports = {
  Custom_yml : Custom_yml
};