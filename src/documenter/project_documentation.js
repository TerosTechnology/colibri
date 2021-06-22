const path_lib = require('path');
const utils = require('../utils/utils');
const fs = require('fs');
const Documenter_lib = require('./documenter');
const Parser = require('../parser/factory');


async function get_md_doc_from_project(project, output_dir_doc, graph, config) {
  await get_doc_from_project(project, output_dir_doc, graph, config, 'markdown');
}

async function get_html_doc_from_project(project, output_dir_doc, graph, config) {
  await get_doc_from_project(project, output_dir_doc, graph, config, 'html');
}

async function get_doc_from_project(project, output_dir_doc, graph, config, type) {
  let self_contained = config.self_contained;
  if (self_contained === undefined){
    self_contained = false;
  }
  
  let symbol_vhdl = config.symbol_vhdl;
  let symbol_verilog = config.symbol_verilog;
  //Internal doc folder
  const INTERNAL_DOC_FOLDER = 'doc_internal';
  const INTERNAL_DOC_FOLDER_COMPLETE = path_lib.join(output_dir_doc,'doc_internal');
  if (!fs.existsSync(INTERNAL_DOC_FOLDER_COMPLETE) && (self_contained === false || type === 'markdown')){
    fs.mkdirSync(INTERNAL_DOC_FOLDER_COMPLETE, { recursive: true });
  }
  //Main doc
  let files = get_sources_as_array(project.files);
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

  let doc_inst_vhdl = new Documenter_lib.Documenter('', 'vhdl', symbol_vhdl, config);
  let doc_inst_verilog = new Documenter_lib.Documenter('', 'verilog', symbol_verilog, config);

  let declaration_finder = new Declaration_finder();

  for (let i = 0; i < files.length; ++i) {
    let file_path = files[i];
    let filename = path_lib.basename(file_path, path_lib.extname(file_path));
    lang = utils.get_lang_from_path(file_path);
    if( lang === 'systemverilog'){
      lang = 'verilog';
    }

    // Only save the doc for a HDL file and exists
    if (lang !== 'none' && fs.existsSync(file_path) === true){
      try{
        let declaration = await declaration_finder.get_declaration_from_file(file_path);
        if (declaration.name !== ''){
          let list_modules_inst = '';
          if (declaration.type === 'entity'){
            list_modules_inst = get_module_str(self_contained, INTERNAL_DOC_FOLDER, filename, declaration.name, type);
          }
          else{
            list_modules_inst = get_package_str(self_contained, INTERNAL_DOC_FOLDER, filename, declaration.name, type);
          }
          // if (self_contained === false){
          //   main_doc += list_modules_inst;
          // }
          // else{
          //   list_modules += list_modules_inst;
          // }
          let contents = fs.readFileSync(files[i], 'utf8');
          let doc_current;
          if (lang === 'vhdl'){
            doc_current = doc_inst_vhdl;
          }
          else{
            doc_current = doc_inst_verilog;
          }
          doc_current.set_code(contents);
          let inst_doc_module = await save_doc(self_contained, type, INTERNAL_DOC_FOLDER_COMPLETE, 
                  filename, doc_current);
          if (self_contained === false && inst_doc_module.error === false){
            main_doc += list_modules_inst;
            main_doc += inst_doc_module.doc;
          }
          else if(inst_doc_module.error === false){
            list_modules += list_modules_inst;
            doc_modules += inst_doc_module.doc;
          }
        }
      }
      catch(e){
        console.log(e);
      }
    }
  }
  if (self_contained === true){
    main_doc += list_modules;
    main_doc += '\n\n';
    main_doc += doc_modules;
  }

  main_doc += get_separation_end(type);
  fs.writeFileSync(output_dir_doc + path_lib.sep + get_index_name(type), main_doc);
}

async function save_doc(self_contained, type, output, filename, doc_inst){
  let result;
  if (self_contained === true && type === 'html'){
    result = await save_doc_self_contained(type, doc_inst);
  }
  else{
    result = await save_doc_separate(type, output, filename, doc_inst);
  }
  return result;
}

async function save_doc_self_contained(type, doc_inst){
  let html_value = '';
  if (type === 'html'){
    let options = { 'html_style': 'save', 'disable_overflow': true};
    const extra_top_space = false;
    html_value = await doc_inst.get_html(options, extra_top_space);
  }
  return {error:html_value.error, doc:html_value.html};
}

async function save_doc_separate(type, output, filename, doc_inst){
  let output_filename =  filename + get_extension(type);
  let output_path = path_lib.join(output, output_filename);
  let error;
  if (type === 'html'){
    error = await doc_inst.save_html(output_path);
  }
  else{
    error = await doc_inst.save_markdown(output_path);
  }
  return {error:error, doc:''};
}

function get_graph_declaration(type, graph, output_dir_doc, output_dir_doc_relative){
  let declaration = '';
  if (type === 'html'){
    declaration += "<h2>Project dependency graph\n</h2>";
    declaration += graph + '\n';
  }
  else{
    declaration += "## Project dependency graph\n";
    declaration += `![system](./${output_dir_doc_relative}/dependency_graph.svg "System")\n`;
    fs.writeFileSync(output_dir_doc + path_lib.sep + "dependency_graph.svg", graph);
  }
  return declaration;
}

function get_title_project(type, project_name){
  let title = `# Project documentation: : ${project_name}\n`;
  if (type === 'html'){
    title = `<h1>Project documentation: ${project_name}</h1>\n`;
  }
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

class Declaration_finder{
  constructor(){
    this.init = false;
  }

  async get_parser(lang){
    if (this.init === false){
      let parser_factory = new Parser.ParserFactory();
      this.vhdl_parser = await parser_factory.getParser('vhdl');
      this.verilog_parser = await parser_factory.getParser('verilog');
      this.init = true;
    }
    if (lang === 'vhdl'){
      return this.vhdl_parser;
    }
    else{
      return this.verilog_parser;
    }
  }

  async get_declaration_from_file(filename){
    let lang = utils.get_lang_from_path(filename);
    if (lang === 'systemverilog'){
      lang = 'verilog';
    }
    let parser = await this.get_parser(lang);
    let code = fs.readFileSync(filename, "utf8");
    let entity_name = await parser.get_entity_or_package_name(code);
    if (entity_name === undefined){
      return '';
    }
    return entity_name;
  }

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