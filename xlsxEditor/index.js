import fs from 'fs';
import Observer from './src/observer.js';
import xlsxParser from './src/xlsxParser.js';
import xlsxEditor from './src/xlsxEditor.js';
import hash from './src/hash.js';
import logs from './src/logs.js';
import http from 'http';
import url from 'url';
import { getDefaultConfig, getUsersConfig } from '../store/index.js';
import { sendLeads } from './skorozwon/mainController.js';

function main() {
  const queue = [{}, {}, {}];

  const sup1 = [];
  const sup2 = [];
  const sup3 = [];

  const dirname = process.cwd().replaceAll('\\', '/');

  const observer = new Observer();

  observer.on(dirname + '/files/Поставщики/Дима', (file) => {
    if (sup1.includes(file)) return;

    sup1.push(file);

    const supplier = getDefaultConfig().suppliers.Дима;

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

                queue.push({ id, dir });
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
    if (sup1.includes(file)) return;

    sup1.push(file);

    const supplier = getDefaultConfig().suppliers.База;

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

                queue.push({ id, dir });
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
    if (sup2.includes(file)) return;

    sup2.push(file);

    const supplier = getDefaultConfig().suppliers.Оля;

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

                queue.push({ id, dir });
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
    if (sup3.includes(file)) return;

    sup3.push(file);

    const supplier = getDefaultConfig().suppliers.Надя;

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

                  queue.push({ id, dir });
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
    const supplier = suppliers[file.userId];

    if (!supplier) {
      return;
    }

    const exitName = file.name.split('.').pop();

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

      if (query.type === 'sendFile') {
        console.log(query);
        onDocument(query);

        response.end('good');
      }

      if (query.type === 'getFile') {
        response.end(JSON.stringify(queue.shift()));
      }
    } else {
      response.end('good');
    }
  });

  server.listen(3027);
}

export const start = main;
