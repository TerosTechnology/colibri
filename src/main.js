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


// exports.VhdlEditor    = require('./editor/vhdleditor')
// exports.VerilogEditor = require('./editor/verilogeditor')
// exports.VhdlParser     = require('./parser/vhdlparser');
// exports.VerilogParser     = require('./parser/verilogparser');
exports.Simulators = require('./simulators/simulators');

//******************************************************************************
//General
//******************************************************************************
exports.General = require('./general/general')
//******************************************************************************
//Linter
//******************************************************************************
exports.Linter    = require('./linter/linter');
//******************************************************************************
//Parser
//******************************************************************************
exports.Parser    = require('./parser/factory');
//******************************************************************************
//Templates
//******************************************************************************
exports.Templates    = require('./templates/templates');
//******************************************************************************
//Templates
//******************************************************************************
exports.Documenter = require('./documenter/documenter');
//******************************************************************************
//ProjectManager
//******************************************************************************
exports.ProjectManager = require('./projectManager/projectManager');
//******************************************************************************
//Formatter
//******************************************************************************
exports.Formatter = require('./formatter/formatter');
