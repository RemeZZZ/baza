const fs = require('fs');

const {
  getDefaultConfig,
  getReplaceConfig,
  getUsersConfig,
  setDefaultConfig,
  setReplaceConfig,
  setUsersConfig,
} = require('../store/index.js');

const dir = process.cwd();

module.exports.getDefaultConfig = (request, response) => {
  response.send(getDefaultConfig());
};

module.exports.getUsersConfig = (request, response) => {
  response.send(getUsersConfig());
};

module.exports.getReplaceConfig = (request, response) => {
  response.send(getReplaceConfig());
};

module.exports.setDefaultConfig = (request, response) => {
  setDefaultConfig(request.body);

  response.send({ message: 'ok' });
};

function setConfigData(name, data) {
  return fs.writeFileSync(`${dir}/data/${name}.json`, JSON.stringify(data));
}

function getConfigData(name) {
  return JSON.parse(fs.readFileSync(`${dir}/data/${name}.json`, 'utf-8'));
}
