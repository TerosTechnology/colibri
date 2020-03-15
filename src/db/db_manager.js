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

const fs = require('fs')
const model = require('./model');
const codes = require('./codes')

// Configuration File
const CONFIGURATION_FILENAME = __dirname + '/resources/configuration.json' // FIXME

var configuration = {}
try {
  // Read previous configuration
  configuration = JSON.parse(fs.readFileSync(CONFIGURATION_FILENAME, "utf8"));
} catch (error) {
  // No previous configuration. Default config
  configuration.standar_active = codes.Standards.VHDL2008;
  configuration.parser_active = codes.Parsers.VHDL;
  configuration.linter_active = codes.Linters.VHDL;
  configuration.editor_active = codes.Editors.VHDL;
  configuration.documenter_active = codes.Documenters.VHDL;
  saveConfiguration();
}
// Every startup, check if we have a conf (default) for each possible linter
createDefaultLinterConfiguration();

function saveConfiguration() {
  fs.writeFile(CONFIGURATION_FILENAME, JSON.stringify(configuration), (err) => {
    if (err) throw err;
  });
}

function createDefaultLinterConfiguration() {
  getAllLinters().then(linter_list => {
    if (typeof configuration.linter_configuration === 'undefined' ||
      configuration.linter_configuration === null) {
      configuration.linter_configuration = {};
    }
    linter_list.forEach(function(linter) {
      if (typeof configuration.linter_configuration[linter.code] === 'undefined' ||
        configuration.linter_configuration[linter.code] === null) {
        configuration.linter_configuration[linter.code] = {
          'path': '',
          'parameters': ''
        }
      }
    })
    saveConfiguration();
  })
}

// Languagues and Standard
function getAllLanguagues() {
  return model.Languague.findAll({
    include: [model.Standard],
    order: [
      [model.Languague.tableAttributes.name.fieldName, 'DESC'],
      [model.Standard, model.Standard.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getActiveStandardCode() {
  return configuration.standar_active;
}

function setActiveStandardCode(standard_code) {
  configuration.standar_active = standard_code;
  saveConfiguration();
}


// Linter
function getAllLinters() {
  return model.Linter.findAll({
    order: [
      [model.Linter.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getLintersByStandard(standard_code) {
  return model.Linter.findAll({
    include: [{
      model: model.Standard,
      where: {
        code: standard_code
      }
    }],
    order: [
      [model.Linter.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getActiveLinterCode() {
  return configuration.linter_active;
}

function setActiveLinterCode(linter_code) {
  configuration.linter_active = linter_code;
  saveConfiguration();
}

function saveLinter(linter_code, path, parameters) {
  configuration.linter_configuration[linter_code].path = path;
  configuration.linter_configuration[linter_code].parameters = parameters;
  saveConfiguration();
}

function getLinterConfigByCode(linter_code) {
  return configuration.linter_configuration[linter_code];
}

// Parser
function getAllParsers() {
  return model.Parser.findAll({
    order: [
      [model.Parser.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getParsersByStandard(standard_code) {
  return model.Parser.findAll({
    include: [{
      model: model.Standard,
      where: {
        code: standard_code
      }
    }],
    order: [
      [model.Parser.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getActiveParserCode() {
  return configuration.parser_active;
}

function setActiveParserCode(parser_code) {
  configuration.parser_active = parser_code;
  saveConfiguration();
}

// Editor
function getAllEditors() {
  return model.Editor.findAll({
    order: [
      [model.Editor.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getEditorsByStandard(standard_code) {
  return model.Editor.findAll({
    include: [{
      model: model.Standard,
      where: {
        code: standard_code
      }
    }],
    order: [
      [model.Editor.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getActiveEditorCode() {
  return configuration.editor_active;
}

function setActiveEditorCode(editor_code) {
  configuration.editor_active = editor_code;
  saveConfiguration();
}

// Documenter
function getAllDocumenters() {
  return model.Documenter.findAll({
    order: [
      [model.Documenter.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getDocumentersByStandard(standard_code) {
  return model.Documenter.findAll({
    include: [{
      model: model.Standard,
      where: {
        code: standard_code
      }
    }],
    order: [
      [model.Documenter.tableAttributes.name.fieldName, 'DESC']
    ]
  })
}

function getActiveDocumenterCode() {
  return configuration.documenter_active;
}

function setActiveDocumenterCode(documenter_code) {
  configuration.documenter_active = documenter_code;
  saveConfiguration();
}

module.exports = {
  getAllLanguagues,
  getActiveStandardCode,
  setActiveStandardCode,

  getAllLinters,
  getLintersByStandard,
  getActiveLinterCode,
  setActiveLinterCode,
  saveLinter,
  getLinterConfigByCode,

  getAllParsers,
  getParsersByStandard,
  setActiveParserCode,
  getActiveParserCode,

  getAllEditors,
  getEditorsByStandard,
  setActiveEditorCode,
  getActiveEditorCode,

  getAllDocumenters,
  getDocumentersByStandard,
  setActiveDocumenterCode,
  getActiveDocumenterCode
}
