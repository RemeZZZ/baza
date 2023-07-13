import fs from 'fs';
import Observer from './src/observer.js';
import xlsxParser from './src/xlsxParser.js';
import xlsxEditor from './src/xlsxEditor.js';
import xlsxComparer from './src/xlsxComparer.js';
import hash from './src/hash.js';
import logs from './src/logs.js';
import http from 'http';
import url from 'url';
import { getDefaultConfig, getUsersConfig } from '../store/index.js';
import { sendLeads } from './skorozwon/mainController.js';
import pm2Controller from '../shell/pm2Controller.js';

function main() {
  const queue = [];
  const tempQueue = [];

  const dirname = process.cwd().replaceAll('\\', '/');

  const observer = new Observer();

  observer.on(dirname + '/files/Поставщики/Дима', (file) => {
    const supplier = getDefaultConfig().suppliers.Дима;
    const baza = getDefaultConfig().suppliers.База;

    xlsxParser(file, (result) => {
      Object.entries(supplier.customers).forEach(([key, value]) => {
        if (value[result.type]) {
          xlsxEditor(
            `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
            result,
            value.columns,
            (dir) => {
              logs(`${dir} отправлен ${key}`);

              getUsersConfig().customers[key].forEach((id) => {
                if (key === 'Скорозвон') {
                  sendLeads(dir, value.tags[result.type]);
                }

                if (!baza.customers[key].timeout) {
                  sendToQueue({
                    id,
                    dir,
                    name: key,
                    hash: result.id,
                    count: result.count,
                  });
                }
              });
            },
            {
              double: value.double,
              numberIsNumber: value.numberIsNumber,
              customer: key,
            },
          );
        }
      });
    });
  });

  observer.on(dirname + '/files/Поставщики/База', (file) => {
    const supplier = getDefaultConfig().suppliers.База;
    const baza = getDefaultConfig().suppliers.База;

    xlsxParser(file, (result) => {
      Object.entries(supplier.customers).forEach(([key, value]) => {
        if (value[result.type]) {
          xlsxEditor(
            `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
            result,
            value.columns,
            (dir) => {
              logs(`${dir} отправлен ${key}`);

              getUsersConfig().customers[key].forEach((id) => {
                if (key === 'Скорозвон') {
                  sendLeads(dir, value.tags[result.type]);
                }

                if (!baza.customers[key].timeout) {
                  sendToQueue({
                    id,
                    dir,
                    name: key,
                    hash: result.id,
                    count: result.count,
                  });
                }
              });
            },
            {
              double: value.double,
              numberIsNumber: value.numberIsNumber,
              customer: key,
            },
          );
        }
      });
    });
  });

  observer.on(dirname + '/files/Поставщики/Оля', (file) => {
    const supplier = getDefaultConfig().suppliers.Оля;
    const baza = getDefaultConfig().suppliers.База;

    xlsxParser(file, (result) => {
      Object.entries(supplier.customers).forEach(([key, value]) => {
        if (value[result.type]) {
          xlsxEditor(
            `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
            result,
            value.columns,
            (dir) => {
              logs(`${dir} отправлен ${key}`);

              getUsersConfig().customers[key].forEach((id) => {
                if (key === 'Скорозвон') {
                  sendLeads(dir, value.tags[result.type]);
                }

                if (!baza.customers[key].timeout) {
                  sendToQueue({
                    id,
                    dir,
                    name: key,
                    hash: result.id,
                    count: result.count,
                  });
                }
              });
            },
            {
              double: value.double,
              numberIsNumber: value.numberIsNumber,
              customer: key,
            },
          );
        }
      });
    });
  });

  observer.on(dirname + '/files/Поставщики/Надя', (file) => {
    const supplier = getDefaultConfig().suppliers.Надя;
    const baza = getDefaultConfig().suppliers.База;

    xlsxParser(file, (result) => {
      Object.entries(supplier.customers).forEach(([key, value]) => {
        if (value[result.type]) {
          if (value[result.fileType]) {
            xlsxEditor(
              `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
              result,
              value.columns,
              (dir) => {
                logs(`${dir} отправлен ${key}`);

                getUsersConfig().customers[key].forEach((id) => {
                  if (key === 'Скорозвон') {
                    sendLeads(dir, value.tags[result.type]);
                  }

                  if (!baza.customers[key].timeout) {
                    sendToQueue({
                      id,
                      dir,
                      name: key,
                      hash: result.id,
                      count: result.count,
                    });
                  }
                });
              },
              {
                double: value.double,
                numberIsNumber: value.numberIsNumber,
                customer: key,
              },
            );
          }
        }
      });
    });
  });

  async function onDocument(file) {
    const suppliers = getUsersConfig().suppliers;
    const admins = getUsersConfig().admins;
    const supplier = suppliers[file.userId];

    if (!supplier) {
      return;
    }

    const exitName = file.name.split('.').pop();

    if (exitName === 'session' && admins.some((id) => +id === +file.userId)) {
      fs.renameSync(`${dirname}/${file.path}`, `${dirname}/user.session`);

      pm2Controller.restartTgBot();

      return;
    }

    if (exitName !== 'xlsx') return;

    const finalDir = `${dirname}/files/Поставщики/${supplier}/${hash(10)}.${
      file.name
    }`;

    logs(
      `Получен файл (${
        file.name
      }) от ${supplier} и временно переименован в ${hash(10)}.${file.name}`,
    );

    fs.renameSync(`${dirname}/${file.path}`, finalDir);
  }

  const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'origin, content-type, accept',
    );

    const { method } = request;

    if (method === 'GET') {
      const query = url.parse(request.url, true).query;
      const users = getUsersConfig();

      if (query.type === 'sendFile') {
        console.log(query);
        onDocument(query);

        response.end('good');
      }

      if (query.type === 'getFile') {
        const item = queue.shift();

        if (!item) {
          response.end();

          return;
        }

        const isBot = users.type[item.id] === 'bot';

        if (query.from === 'bot' && isBot) {
          response.end(JSON.stringify(item));
        } else if (query.from !== 'bot' && !isBot) {
          response.end(JSON.stringify(item));
        } else {
          queue.unshift(item);

          response.end('good');
        }
      }
    } else {
      response.end('good');
    }
  });

  async function sendToQueue({ id, dir, name, hash, count }) {
    if (hash) {
      tempQueue.push({ id, dir, name, hash });

      const items = tempQueue.filter((item) => item.hash === hash);

      console.log(items.length, count);

      if (items.length === count) {
        const finallyDir = await xlsxComparer(items.map((item) => item.dir));

        queue.push({ id, name, dir: finallyDir });
      }
    } else {
      queue.push({ id, dir, name, hash });
    }
  }

  server.listen(3027);
}

export const start = main;
