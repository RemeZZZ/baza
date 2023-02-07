const dirname = process.cwd().replaceAll('\\', '/');

import fs from 'fs';

class Task {
  getFilesByPeriod(customer, period, callback) {
    const date = new Date();

    const dir = `${dirname}/files/Заказчики/${customer}`;
    const day = date.getDate();
    const month = date.getMonth() + 1;

    const dirs = [];

    try {
      dirs.push(...fs.readdirSync(dir));
    } catch {
      console.log('Заказчик не найден');
    }

    dirs.forEach((type) => {
      const typeDir = `${dir}/${type}`;

      const files = fs.readdirSync(typeDir).filter((file) => {
        const [fileDay, fileMonth] = file.split('.');

        return +fileDay === day && +fileMonth === month;
      });

      console.log(files);
    });
  }
}

export default new Task();
