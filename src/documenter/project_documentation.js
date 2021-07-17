// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
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

/* eslint-disable no-empty */
const path_lib = require('path');
const utils = require('../utils/utils');
const fs = require('fs');
const Documenter_lib = require('./documenter');
const declaration_finder = require('../utils/utils');
const css_style_lib = require('./css_style');

async function get_md_doc_from_project(project, output_dir_doc, graph, config, cli_bar) {
  let result = await get_doc_from_project(project, output_dir_doc, graph, config, 'markdown', cli_bar);
  return result;
}

async function get_html_doc_from_project(project, output_dir_doc, graph, config, cli_bar) {
  let result = await get_doc_from_project(project, output_dir_doc, graph, config, 'html', cli_bar);
  return result;
}

async function get_doc_from_project(project, output_dir_doc, graph, config, type, cli_bar=undefined) {
  let ok_files = 0;
  let fail_files = 0;

  let self_contained = config.self_contained;
  if (self_contained === undefined){
    self_contained = false;
  }
  
  //Internal doc folder
  const INTERNAL_DOC_FOLDER = 'doc_internal';
  const INTERNAL_DOC_FOLDER_COMPLETE = path_lib.join(output_dir_doc,'doc_internal');
  if (!fs.existsSync(INTERNAL_DOC_FOLDER_COMPLETE) && (self_contained === false || type === 'markdown')){
    fs.mkdirSync(INTERNAL_DOC_FOLDER_COMPLETE, { recursive: true });
  }
  //Main doc
  let files = get_sources_as_array(project.files);
  cli_bar.start(files.length, 0);

  let project_name = project.name;
  let main_doc = get_title_project(type, project_name);
  if (config.dependency_graph === true && graph !== undefined) {
    main_doc += get_graph_declaration(type, graph, INTERNAL_DOC_FOLDER_COMPLETE, INTERNAL_DOC_FOLDER);
  }
  main_doc += get_title_design(type);
  let lang = "none";
  main_doc += get_separation_init(type);
  let doc_modules = '';
  let list_modules = '';

  let doc_current = new Documenter_lib.Documenter(config);

  for (let i = 0; i < files.length; ++i) {    
    let file_path = files[i];
    let file_path_name = path_lib.basename(file_path);
    
    let filename = path_lib.basename(file_path, path_lib.extname(file_path));
    lang = utils.get_lang_from_path(file_path);
    if( lang === 'systemverilog'){
      lang = 'verilog';
    }
    
    // Only save the doc for a HDL file and exists
    if (lang !== 'none' && fs.existsSync(file_path) === true){

      let contents = fs.readFileSync(files[i], 'utf8');
      if (contents.split(/\r\n|\r|\n/).length < 8000){
        
        cli_bar.update(i, {filename: file_path_name});
        try{
          config.input_path = file_path;
          let declaration = await declaration_finder.get_declaration_from_path(file_path);
          if (declaration.name !== ''){
            ok_files += 1;
            let list_modules_inst = '';
            if (declaration.type === 'entity'){
              list_modules_inst = get_module_str(self_contained, INTERNAL_DOC_FOLDER, filename, declaration.name, type);
            }
            else{
              list_modules_inst = get_package_str(self_contained, INTERNAL_DOC_FOLDER, 
                    filename, declaration.name, type);
            }
            let inst_doc_module = await save_doc(self_contained, type, INTERNAL_DOC_FOLDER_COMPLETE, 
                    filename, doc_current, contents, lang, config);
            if (self_contained === false && inst_doc_module.error === false){
              main_doc += list_modules_inst;
              main_doc += inst_doc_module.doc;
            }
            else if(inst_doc_module.error === false){
              list_modules += list_modules_inst;
              doc_modules += inst_doc_module.doc;
            }
          }
          else{
            fail_files += 1;
          }
        }
        catch(e){
        }
      }
      else{
        fail_files += 1;
      }
    }
  }
  if (self_contained === true){
    main_doc += list_modules;
    main_doc += '\n\n';
    main_doc += doc_modules;
    main_doc = css_style_lib.html_style_save + main_doc;
  }

  main_doc += get_separation_end(type);
  fs.writeFileSync(output_dir_doc + path_lib.sep + get_index_name(type), main_doc);
  // Stop the progress bar
  cli_bar.update(files.length);
  cli_bar.stop();
  return {'fail_files':fail_files, 'ok_files':ok_files};
}

async function save_doc(self_contained, type, output, filename, doc_inst, code, lang, config){
  let result;
  if (self_contained === true && type === 'html'){
    result = await save_doc_self_contained(type, doc_inst, code, lang, config);
  }
  else{
    result = await save_doc_separate(type, output, filename, doc_inst, code, lang, config);
  }
  return result;
}

async function save_doc_self_contained(type, doc_inst, code, lang, config){
  config.html_style = true;
  let html_value = '';
  if (type === 'html'){
    config.html_style = 'save';
    config.extra_top_space = false;
    html_value = await doc_inst.get_html(code, lang, config);
  }
  return {error:html_value.error, doc:html_value.html};
}

async function save_doc_separate(type, output, filename, doc_inst, code, lang, config){
  let output_filename =  filename + get_extension(type);
  let output_path = path_lib.join(output, output_filename);
  let error;
  if (type === 'html'){
    error = await doc_inst.save_html(code, lang, config, output_path);
  }
  else{
    error = await doc_inst.save_markdown(code, lang, config, output_path);
  }
  return {error:error, doc:''};
}

function get_graph_declaration(type, graph, output_dir_doc, output_dir_doc_relative){
  let declaration = '';
  if (type === 'html'){
    declaration += graph + '\n';
  }
  else{
    declaration += `![system](./${output_dir_doc_relative}/dependency_graph.svg "System")\n`;
    fs.writeFileSync(output_dir_doc + path_lib.sep + "dependency_graph.svg", graph);
  }
  return declaration;
}

function get_date(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours().toString().padStart(2, '0');
  let minutes = date_ob.getMinutes().toString().padStart(2, '0');
  let seconds = date_ob.getSeconds().toString().padStart(2, '0');
  let date_str = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return date_str.padEnd(19);
}

function get_title_project(type, project_name){
  let date = get_date();

  let title = '';
  if (type === 'html'){
    title = `<h1>Documentation for: ${project_name}</h1>\n\n`;
    title += 'Generated by <strong>TerosHDL</strong> © 2020-2021 License GPLv3<br>';
  }
  else{
    title = `# Documentation for: ${project_name}\n\n`;
    title += 'Generated by **TerosHDL** © 2020-2021 License GPLv3<br>';
  }
  title += 'Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)<br>';
  title += 'Ismael Perez Rojo (ismaelprojo@gmail.com)<br><br>';
  title += `<br><br>Project revision ${date}\n`;
  return title;
}

function get_title_design(type){
  let title = `## Designs\n`;
  if (type === 'html'){
    title = "<h2>Designs\n</h2>";
  }
  return title;
}

function get_module_str(self_contained, folder, filename, name, type){
  let declaration = `- Module: [${name} ](./${folder}/${filename}.md)\n`;
  if (self_contained === false && type === 'html'){
    declaration = `  <li>Module: <a href="${folder}/${filename}.html">${name}</a>\n</li>`;
  }
  else if(self_contained === true && type === 'html'){
    declaration = `  <li>Module: <a href="#${name}">${name}</a>\n</li>`;
  }
  return declaration;
}

function get_package_str(self_contained, folder, filename, name, type){
  let declaration = `- Package: [${name} ](./${folder}/${filename}.md)\n`;
  if (self_contained === false && type === 'html'){
    declaration = `  <li>Package: <a href="${folder}/${filename}.html">${name}</a>\n</li>`;
  }
  else if(self_contained === true && type === 'html'){
    declaration = `  <li>Package: <a href="#${name}">${name}</a>\n</li>`;
  }
  return declaration;
}

function get_separation_init(type){
  let declaration = '\n';
  if (type === 'html'){
    declaration = '<ul>';
  }
  return declaration;
}

function get_separation_end(type){
  let declaration = '\n';
  if (type === 'html'){
    declaration = '</ul>';
  }
  return declaration;
}

function get_index_name(type){
  let declaration = 'README.md';
  if (type === 'html'){
    declaration = 'index.html';
  }
  return declaration;
}

function get_extension(type){
  let declaration = '.md';
  if (type === 'html'){
    declaration = '.html';
  }
  return declaration;
}

function get_sources_as_array(files_edam){
  let sources = [];
  for (let i = 0; i < files_edam.length; i++) {
    const element = files_edam[i];
    sources.push(element.name);
  }
  return sources;
}

module.exports = {
  get_html_doc_from_project: get_html_doc_from_project,
  get_md_doc_from_project: get_md_doc_from_project
};