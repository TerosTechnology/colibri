const path_lib = require('path');
const utils = require('../utils/utils');
const fs = require('fs');
const Documenter_lib = require('./documenter');
const Parser = require('../parser/factory');


async function get_md_doc_from_project(project, output_dir_doc, graph, config) {
  get_doc_from_project(project, output_dir_doc, graph, config, 'markdown');
}

async function get_html_doc_from_project(project, output_dir_doc, graph, config) {
  get_doc_from_project(project, output_dir_doc, graph, config, 'html');
}

async function get_doc_from_project(project, output_dir_doc, graph, config, type) {
  let symbol_vhdl = config.symbol_vhdl;
  let symbol_verilog = config.symbol_verilog;
  //Internal doc folder
  const INTERNAL_DOC_FOLDER = 'doc_internal';
  const INTERNAL_DOC_FOLDER_COMPLETE = path_lib.join(output_dir_doc,'doc_internal');
  if (!fs.existsSync(INTERNAL_DOC_FOLDER_COMPLETE)){
    fs.mkdirSync(INTERNAL_DOC_FOLDER_COMPLETE);
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
  let symbol = "!";
  main_doc += get_separation_init(type);
  for (let i = 0; i < files.length; ++i) {
    let file_path = files[i];
    let filename = path_lib.basename(file_path, path_lib.extname(file_path));
    lang = utils.get_lang_from_path(file_path);
    if (lang === 'vhdl'){
      symbol = symbol_vhdl;
    }
    else if(lang === 'verilog' || lang === 'systemverilog'){
      symbol = symbol_verilog;
    }

    // Only save the doc for a HDL file and exists
    if (lang !== 'none' && fs.existsSync(file_path) === true){
      let declaration = await get_declaration_from_file(file_path);
      if (declaration.type === 'entity'){
        main_doc += get_module_str(INTERNAL_DOC_FOLDER, filename, declaration.name, type);
      }
      else{
        main_doc += get_package_str(INTERNAL_DOC_FOLDER, filename, declaration.name, type);
      }
      let contents = fs.readFileSync(files[i], 'utf8');
      let doc_inst = new Documenter_lib.Documenter(contents, lang, symbol, config);
      if (type === 'html'){
        doc_inst.save_html(INTERNAL_DOC_FOLDER_COMPLETE + path_lib.sep + filename + get_extension(type));
      }
      else{
        doc_inst.save_markdown(INTERNAL_DOC_FOLDER_COMPLETE + path_lib.sep + filename + get_extension(type));
      }
    }
  }
  main_doc += get_separation_end(type);
  fs.writeFileSync(output_dir_doc + path_lib.sep + get_index_name(type), main_doc);
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

function get_module_str(folder, filename, name, type){
  let declaration = `- Module: [+ ${name} ](./${folder}/${filename}.md)\n`;
  if (type === 'html'){
    declaration = `  <li>Module: <a href="${folder}/${filename}.html">${name}</a>\n</li>`;
  }
  return declaration;
}

function get_package_str(folder, filename, name, type){
  let declaration = `- Package: [+ ${name} ](./${folder}/${filename}.md)\n`;
  if (type === 'html'){
    declaration = `  <li>Package: <a href="${folder}/${filename}.html">${name}</a>\n</li>`;
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

async function get_declaration_from_file(filename){
  let lang = utils.get_lang_from_path(filename);
  let parser_factory = new Parser.ParserFactory();
  let parser = await parser_factory.getParser(lang);

  let code = fs.readFileSync(filename, "utf8");
  let entity_name = await parser.get_entity_or_package_name(code);
  if (entity_name === undefined){
    return '';
  }
  return entity_name;
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