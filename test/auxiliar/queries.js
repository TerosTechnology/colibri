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
