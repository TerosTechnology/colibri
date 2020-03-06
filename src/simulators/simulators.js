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
