/* eslint-disable no-console */
const fs = require('fs');
const shell = require('shelljs');
const path_lib = require('path');
let colibri = require('../src/main.js');

function doc_trs(options){
  let trs_file = options.file;
  let out = options.out;
  try {
    let doc_path = "built_doc";
    let trs_path = path_lib.dirname(trs_file);
    let out_dir = `${trs_path}/${doc_path}`;
    fs.mkdirSync(out_dir);
    const doc = JSON.parse(fs.readFileSync(trs_file, 'utf8'));
    shell.cd(trs_path);
    doc_trs_ip(doc,doc_path, out);
  } catch (e) {
    console.log(e);
  }
}

function doc_trs_ip(doc, path, out){
  let file_list =[];
  let project_name = doc.name;
  for (let x=0; x<doc.files.length;x++) {
    file_list.push(doc.files[x].name);
  }
  switch (out) {
    case "html":
      save_doc_html_trs(file_list,path,project_name);
      break;
    case "md":
      save_doc_md_trs(file_list,path,project_name);
      break;
    default:
      save_doc_md_trs(file_list,path,project_name);
      break;
  }
}

async function save_doc_md_trs(files, path, project_name){
  let symbol_vhdl = '!';
  let symbol_verilog = '!';

  let config = {'custom_section': undefined, 
    'custom_svg_path': undefined, 
    'custom_svg_path_in_readme': undefined,
    'fsm': true,
    'signals': 'none',
    'constants': 'none',
    'process': 'none'
    };

    let with_dependency_graph = true;
    let python3_path = "";

  let dependency_graph = new dependency.Dependency_graph();
  let svg_dependency_graph = await dependency_graph.get_dependency_graph_svg(gen_names_str(files), python3_path);
  colibri.Documenter.get_md_doc_from_array(files, path, symbol_vhdl, symbol_verilog,
    svg_dependency_graph, project_name, with_dependency_graph, config);
}


async function save_doc_html_trs(files, path, project_name){
  let symbol_vhdl = '!';
  let symbol_verilog = '!';
  
  let config = {'custom_section': undefined, 
    'custom_svg_path': undefined, 
    'custom_svg_path_in_readme': undefined,
    'fsm': true,
    'signals': 'none',
    'constants': 'none',
    'process': 'none'
  };

  let with_dependency_graph = true;
  let python3_path = "";

  let dependency_graph = new dependency.Dependency_graph();
  let svg_dependency_graph = await dependency_graph.get_dependency_graph_svg(gen_names_str(files), python3_path);
  colibri.Documenter.get_html_doc_from_array(files, path, symbol_vhdl, symbol_verilog,
    svg_dependency_graph, project_name, with_dependency_graph, config); 
}

function gen_names_str(files){
  let sources = [];
  for (let i = 0; i < files.length; i++) {
    sources.push({name: files[i]});
  }
  return sources;
}

module.exports = {
  doc_trs : doc_trs
};