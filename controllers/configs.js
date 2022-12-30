import {
  getDefaultConfig,
  getReplaceConfig,
  getUsersConfig,
  setDefaultConfig,
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

  setDefaultConfig(request, response) {
    setDefaultConfig(request.body);

    response.send({ message: 'ok' });
  },
};
