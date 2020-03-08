// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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

const db_manager = require('../../src/db/db_manager')

db_manager.getAllLanguagues().then(languagues => {
  languagues.forEach(function(lan) {
    console.log(lan.name);
    lan.standards.forEach(function(standard) {
      console.log(standard.name);
    })
  })
})

db_manager.getActiveStandard().then(standard => console.log(standard))

db_manager.getLintersByStandard('vhdl08').then(linter_list => {
  linter_list.forEach(function(linter) {
    console.log(linter.name);
  })
})

// db_manager.getActiveStandard().then(standard => db_manager.setActiveStandard(standard))
//
// db_manager.getActiveLinter().then(standard => db_manager.setActiveLinter(standard))
//
// db_manager.getActiveParser().then(standard => db_manager.setActiveParser(standard))
