import pm2Controller from '../shell/pm2Controller.js';

export function restartTgClient(request, response) {
  pm2Controller.restartTgBot();

  response.send({ message: 'success' });
}
