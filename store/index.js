const dir = process.cwd();

import { readFileSync, writeFileSync } from 'fs';

export function getDefaultConfig() {
  return JSON.parse(readFileSync(`${dir}/data/config.json`, 'utf-8'));
}
export function getUsersConfig() {
  return JSON.parse(readFileSync(`${dir}/data/users.config.json`, 'utf-8'));
}
export function getReplaceConfig() {
  return JSON.parse(readFileSync(`${dir}/data/replace.config.json`, 'utf-8'));
}

export function getTargetsConfig() {
  return JSON.parse(readFileSync(`${dir}/data/targets.config.json`, 'utf-8'));
}

export function setDefaultConfig(config) {
  writeFileSync(`${dir}/data/config.json`, JSON.stringify(config));
}

export function setUsersConfig(config) {
  writeFileSync(`${dir}/data/users.config.json`, JSON.stringify(config));
}

export function setReplaceConfig(config) {
  writeFileSync(`${dir}/data/replace.config.json`, JSON.stringify(config));
}

export function setTargetsConfig(config, force) {
  let defaultConfig = getTargetsConfig();

  config.forEach((item) => {
    if (!defaultConfig.some((user) => +user.id === item.id)) {
      defaultConfig.push(item);
    }
  });

  if (force) {
    defaultConfig = config;
  }

  writeFileSync(
    `${dir}/data/targets.config.json`,
    JSON.stringify(defaultConfig),
  );
}
