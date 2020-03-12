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

const axios = require("axios");
const Codes = require('./codes')

class Simulators {

  async getSuites(ip,port){
    var rsp = {result:null,data:null};
    const baseURL = 'http://'+ip+":"+port
    const url = baseURL+'/suites/';
    const getData = async url => {
      try {
        const response = await axios.get(url);
        rsp['result'] = Codes.CODE_RESPONSE['SUCCESSFUL'];
        rsp['data']   = response.data;
        return await rsp;
      } catch (error) {
        rsp['result'] = Codes.CODE_RESPONSE['UNREACHABLE_SERVER'];
        return await rsp;
      }
    };
    return await getData(url);
  }

  async simulate(ip,port,project){
    var rsp = {result:null,data:null};
    const baseURL = 'http://'+ip+":"+port
    const url = baseURL+'/tests/';
    const getData = async url => {
      try {
        const response = await axios.post(url,project);
        rsp['result'] = Codes.CODE_RESPONSE['SUCCESSFUL'];
        rsp['data']   = response.data;
        return await rsp;
      } catch (error) {
        rsp['result'] = Codes.CODE_RESPONSE['UNREACHABLE_SERVER'];
      }
    };
    return await getData(url);
  }
}

module.exports = {
  Codes : Codes,
  Simulators : Simulators
}
