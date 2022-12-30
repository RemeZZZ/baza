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

export function setDefaultConfig(config) {
  writeFileSync(`${dir}/data/config.json`, JSON.stringify(config));
}

export function setUsersConfig(config) {
  writeFileSync(`${dir}/data/users.config.json`, JSON.stringify(config));
}

export function setReplaceConfig(config) {
  writeFileSync(`${dir}/data/replace.config.json`, JSON.stringify(config));
}
