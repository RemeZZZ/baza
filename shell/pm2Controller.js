import cmd from 'node-cmd';

class Pm2Controller {
  restartTgBot() {
    cmd.run('pm2 restart 6');
  }
}

export default new Pm2Controller();
