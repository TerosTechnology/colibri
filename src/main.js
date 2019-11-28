// exports.VhdlEditor    = require('./editor/vhdleditor')
// exports.VerilogEditor = require('./editor/verilogeditor')
exports.VhdlParser     = require('./parser/vhdlparser');
exports.VerilogParser     = require('./parser/verilogparser');
exports.Simulators = require('./simulators/simulators');

//******************************************************************************
//General
//******************************************************************************
exports.General = require('./general/general')
//******************************************************************************
//Linter
//******************************************************************************
exports.Linter    = require('./linter/factory');
//******************************************************************************
//Templates
//******************************************************************************
exports.Templates    = require('./templates/templates');
//******************************************************************************
//Templates
//******************************************************************************
exports.Documenter = require('./documenter/documenter');
