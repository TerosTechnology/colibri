const axios = require("axios");
const Codes = require('./codes')

class Manager {
  constructor(ip,port){
    this.url = 'http://'+ip+":"+port;
  }

  async getSuites(){
    var rsp = {result:null,data:null};
    const url = this.url+'/suites/';
    const getData = async url => {
      try {
        const response = await axios.get(url);
        rsp['result'] = Codes.CODE_RESPONSE['SUCCESSFUL'];
        rsp['data']   = response.data;
        return rsp;
      } catch (error) {
        console.log(error);
        rsp['result'] = Codes.CODE_RESPONSE['UNREACHABLE_SERVER'];
        return rsp;
      }
    };
    return await getData(url);
  }

  async runTool(project){
    const url = this.url+'/tests/';
    const getData = async url => {
      try {
        const response = await axios.post(url,project);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    return await getData(url);
  }

  async runCocotb(project){
    const url = this.url+'/tests/';
    const getData = async url => {
      try {
        const response = await axios.post(url,project);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    return await getData(url);
  }

  async runEdalize(project){
    const url = this.url+'/tests/';
    const getData = async url => {
      try {
        const response = await axios.post(url,project);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    };
    return await getData(url);
  }
}

module.exports = {
  Codes : Codes,
  Manager : Manager
}
