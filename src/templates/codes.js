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
