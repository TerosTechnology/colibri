const axios = require("axios");


class Manager {
  constructor(ip,port){
    this.url = 'http://'+ip+":"+port;
  }

  async getSuites(){
    const url = this.url+'/suites/';
    const getData = async url => {
      try {
        const response = await axios.get(url);
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
  Manager : Manager
}
