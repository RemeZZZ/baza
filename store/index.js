const dir = process.cwd();

const fs = require('fs');

module.exports.getDefaultConfig = () =>
  JSON.parse(fs.readFileSync(`${dir}/data/config.json`, 'utf-8'));
module.exports.getUsersConfig = () =>
  JSON.parse(fs.readFileSync(`${dir}/data/users.config.json`, 'utf-8'));
module.exports.getReplaceConfig = () =>
  JSON.parse(fs.readFileSync(`${dir}/data/replace.config.json`, 'utf-8'));

module.exports.setDefaultConfig = (config) => {
  fs.writeFileSync(`${dir}/data/config.json`, JSON.stringify(config));
};

module.exports.setUsersConfig = (config) => {
  fs.writeFileSync(`${dir}/data/users.config.json`, JSON.stringify(config));
};

module.exports.setReplaceConfig = (config) => {
  fs.writeFileSync(`${dir}/data/replace.config.json`, JSON.stringify(config));
};
