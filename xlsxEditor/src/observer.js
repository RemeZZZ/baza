const watch = require("watch");

class Observer {
  on(dir, callback) {
    watch.createMonitor(dir, (monitor) => {
      monitor.on("created", (file) => {
        callback(file);
      });
    });
  }
}

module.exports = Observer;
