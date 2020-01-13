const TYPES = {
  COCOTB : 'cocotb',
  VERILATOR : 'verilator',
  VUNIT : 'vunit',
  TESTBENCH : 'tb',
  COMPONENT : 'component',
};

const TYPESCOMPONENTS = {
  COMPONENT : 'component',
  INSTANCE : 'instance',
  SIGNALS : 'signals'
};

const TYPESTESTBENCH = {
  GENERAL : 'normal',
  VUNIT : 'vunit'
};

//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  TYPES : TYPES,
  TYPESCOMPONENTS: TYPESCOMPONENTS,
  TYPESTESTBENCH : TYPESTESTBENCH 
}
