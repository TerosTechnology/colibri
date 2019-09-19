const axios = require("axios");


class Manager {
  constructor(ip,port){
    this.url = 'http://'+ip+":"+port;
  }

  async getSuites(ip,port){
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
    var example = {
        "name": project["name"],
        "top_level": project["top_level"],
        "simulator": 2,
        "language": 2,
        "module": project["module"],
        "files": project["files"]
    }

    const url = this.url+'/coco/';
    const getData = async url => {
      try {
        const response = await axios.post(url,example);
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
