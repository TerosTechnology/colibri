const path_lib = require('path');
const utils = require('../utils/utils');
const fs = require('fs');
const Documenter_lib = require('./documenter');
const Parser = require('../parser/factory');

async function get_md_doc_from_project(project, output_dir_doc, graph, config) {
  let symbol_vhdl = config.symbol_vhdl;
  let symbol_verilog = config.symbol_verilog;

  //Main doc
  let files = get_sources_as_array(project.files);
  let project_name = project.name;
  let main_doc = `# Project documentation: : ${project_name}\n`;
  if (config.dependency_graph === true && graph !== undefined) {
    main_doc += "# Project dependency graph\n";
    main_doc += '![system](./dependency_graph.svg "System")';
    fs.writeFileSync(output_dir_doc + path_lib.sep + "dependency_graph.svg", graph);
  }
  let lang = "none";
  let symbol = "!";
  main_doc += '\n';
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
        main_doc += "- Module: [" + declaration.name + "](./" + filename + ".md)\n";
      }
      else{
        main_doc += "- Package: [" + declaration.name + "](./" + filename + ".md)\n";
      }
      let contents = fs.readFileSync(files[i], 'utf8');
      let doc_inst = new Documenter_lib.Documenter(contents, lang, symbol, config);
      doc_inst.save_markdown(output_dir_doc + path_lib.sep + filename + ".md");
    }
  }
  fs.writeFileSync(output_dir_doc + path_lib.sep + "README.md", main_doc);
}

async function get_html_doc_from_project(project, output_dir_doc, graph, config) {
  let symbol_vhdl = config.symbol_vhdl;
  let symbol_verilog = config.symbol_verilog;

  //Main doc
  let files = get_sources_as_array(project.files);
  let project_name = project.name;
  let main_doc = `<h1>Project documentation: ${project_name}</h1>\n`;
  if (config.dependency_graph === true && graph !== undefined) {
    main_doc += "<h2>Project dependency graph\n</h2>";
    main_doc += graph + '\n';
    main_doc += "<h2>Files\n</h2>";
  }
  let lang = "none";
  let symbol = "!";
  main_doc += '<ul>';
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
        main_doc += `  <li>Module: <a href="${filename}.html">${declaration.name}</a>\n</li>`;
      }
      else{
        main_doc += `  <li>Package: <a href="${filename}.html">${declaration.name}</a>\n</li>`;
      }
      let contents = fs.readFileSync(files[i], 'utf8');
      let doc_inst = new Documenter_lib.Documenter(contents, lang, symbol, config);
      doc_inst.save_html(output_dir_doc + path_lib.sep + filename + ".html");
    }
  }
  main_doc += '</ul>';
  fs.writeFileSync(output_dir_doc + path_lib.sep + "index.html", main_doc);
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