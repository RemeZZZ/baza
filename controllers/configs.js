import {
  getDefaultConfig,
  getReplaceConfig,
  getUsersConfig,
  getTargetsConfig,
  setDefaultConfig,
  setTargetsConfig,
  setReplaceConfig,
} from '../store/index.js';

import { getOperators } from '../xlsxEditor/skorozwon/mainController.js';

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

  async getTargetsConfig(request, response) {
    const operators = await getOperators();

    setTargetsConfig(operators);

    response.send(getTargetsConfig());
  },

  setDefaultConfig(request, response) {
    setDefaultConfig(request.body);

    response.send({ message: 'ok' });
  },
  setTargetsConfig(request, response) {
    setTargetsConfig(request.body, true);

    response.send({ message: 'ok' });
  },
  setReplaceConfig(request, response) {
    setReplaceConfig(request.body);

    response.send({ message: 'ok' });
  },
};
