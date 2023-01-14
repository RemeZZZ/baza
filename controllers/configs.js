import {
  getDefaultConfig,
  getReplaceConfig,
  getUsersConfig,
  getTargetsConfig,
  setDefaultConfig,
  setTargetsConfig,
} from '../store/index.js';

export default {
  getDefaultConfig(request, response) {
    response.send(getDefaultConfig());
  },

  getUsersConfig(request, response) {
    response.send(getUsersConfig());
  },

  getReplaceConfig(request, response) {
    response.send(getReplaceConfig());
  },

  getTargetsConfig(request, response) {
    response.send(getTargetsConfig());
  },

  setDefaultConfig(request, response) {
    setDefaultConfig(request.body);

    response.send({ message: 'ok' });
  },
  setTargetsConfig(request, response) {
    setTargetsConfig(request.body);

    response.send({ message: 'ok' });
  },
};
