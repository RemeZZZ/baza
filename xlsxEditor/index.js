function main() {
  const fs = require('fs');
  const Observer = require('./src/observer.js');
  const xlsxParser = require('./src/xlsxParser.js');
  const xlsxEditor = require('./src/xlsxEditor.js');
  const hash = require('./src/hash.js');
  const logs = require('./src/logs.js');
  const http = require('http');
  const url = require('url');
  const { getDefaultConfig, getUsersConfig } = require('../store/index.js');

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
          if (result.new && !value[result.new]) {
            return;
          }
          xlsxEditor(
            `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
            result,
            value.columns,
            (dir) => {
              logs(`${dir} отправлен ${key}`);

              getUsersConfig().customers[key].forEach((id) =>
                queue.push({ id, dir }),
              );
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
          if (result.new && !value[result.new]) {
            return;
          }
          xlsxEditor(
            `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
            result,
            value.columns,
            (dir) => {
              logs(`${dir} отправлен ${key}`);

              getUsersConfig().customers[key].forEach((id) =>
                queue.push({ id, dir }),
              );
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
            if (result.new && !value[result.new]) {
              return;
            }
            xlsxEditor(
              `/files/Заказчики/${key.replace('cus_', '')}/${result.type}`,
              result,
              value.columns,
              (dir) => {
                logs(`${dir} отправлен ${key}`);

                getUsersConfig().customers[key].forEach((id) =>
                  queue.push({ id, dir }),
                );
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
    const suppliers = Object.entries(getUsersConfig().suppliers);

    console.log(suppliers, file.userId);

    const supplier = suppliers.find((item) => item[1] === file.userId);

    console.log(supplier);

    const exitName = file.name.split('.').pop();

    if (exitName !== 'xlsx') return;

    const finalDir = `${dirname}/files/Поставщики/${supplier[0]}/${hash(10)}.${
      file.name
    }`;

    logs(
      `Получен файл (${file.name}) от ${
        supplier[0]
      } и временно переименован в ${hash(10)}.${file.name}`,
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

module.exports.start = main;
