import { createMonitor } from 'watch';

class Observer {
  on(dir, callback) {
    createMonitor(dir, (monitor) => {
      monitor.on('created', (file) => {
        callback(file);
      });
    });
  }
}

export default Observer;
