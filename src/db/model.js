// Copyright 2020 Teros Tech
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Enrique Sáez
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

const Sequelize = require('sequelize');
const Model = Sequelize.Model;


// Database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/resources/database.sqlite',

  define: {
    timestamps: true,
    underscored: true,
    version: true
  }
});


// Model
// Languague
class Languague extends Model {}
Languague.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'languague',
  tableName: 'languague'
});

// Standard
class Standard extends Model {}
Standard.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'standard',
  tableName: 'standard'
});

Languague.hasMany(Standard);
Standard.belongsTo(Languague);

// Parser
class Parser extends Model {}
Parser.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'parser',
  tableName: 'parser'
});

class ParserStandard extends Model {}
ParserStandard.init({}, {
  sequelize,
  modelName: 'parser_standard',
  tableName: 'parser_standard'
});

Parser.belongsToMany(Standard, {
  through: ParserStandard
});
Standard.belongsToMany(Parser, {
  through: ParserStandard
});

// Linter
class Linter extends Model {}
Linter.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  external: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'linter',
  tableName: 'linter'
});

class LinterStandard extends Model {}
LinterStandard.init({}, {
  sequelize,
  modelName: 'linter_standard',
  tableName: 'linter_standard'
});

Linter.belongsToMany(Standard, {
  through: LinterStandard
});
Standard.belongsToMany(Linter, {
  through: LinterStandard
});

// Editor
class Editor extends Model {}
Editor.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'editor',
  tableName: 'editor'
});

class EditorStandard extends Model {}
EditorStandard.init({}, {
  sequelize,
  modelName: 'editor_standard',
  tableName: 'editor_standard'
});

Editor.belongsToMany(Standard, {
  through: EditorStandard
});
Standard.belongsToMany(Editor, {
  through: EditorStandard
});

// Documenter
class Documenter extends Model {}
Documenter.init({
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'documenter',
  tableName: 'documenter'
});

class DocumenterStandard extends Model {}
DocumenterStandard.init({}, {
  sequelize,
  modelName: 'documenter_standard',
  tableName: 'documenter_standard'
});

Documenter.belongsToMany(Standard, {
  through: EditorStandard
});
Standard.belongsToMany(Documenter, {
  through: EditorStandard
});

// Exports
module.exports = {
  sequelize,
  Languague,
  Standard,
  Parser,
  ParserStandard,
  Linter,
  LinterStandard,
  Editor,
  EditorStandard,
  Documenter,
  DocumenterStandard
}
