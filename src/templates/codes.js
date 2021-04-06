// Copyright 2020-2021 Teros Technology
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

const TYPES = {
  COCOTB : 'cocotb',
  VERILATOR : 'verilator',
  VUNIT : 'vunit',
  TESTBENCH : 'tb',
  COMPONENT : 'component',
  MIX_COMPONENT : 'mix_component'
};

const TYPESCOMPONENTS = {
  COMPONENT : 'component',
  INSTANCE : 'instance',
  INSTANCE_VHDL2008 : 'instance_vhdl_2008',
  SIGNALS : 'signals',
  MIX_INSTANCE : 'mix_instance',
  MIX_INSTANCE_VHDL2008 : 'mix_instance_vhdl_2008',
  MIX_SIGNALS : 'mix_signals',
  MIX_COMPONENT : 'mix_component'
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
};
