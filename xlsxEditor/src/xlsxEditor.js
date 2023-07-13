import xlsx from 'xlsx-populate';
import getHash from './hash.js';
import {
  existsSync,
  writeFileSync,
  readFileSync,
  mkdirSync,
  access,
  mkdir,
} from 'fs';
import logs from './logs.js';
import { bankRouter, allowBanks } from '../banks/mainController.js';

const existFile = existsSync('./ogrns.json');

if (!existFile) {
  writeFileSync('./ogrns.json', JSON.stringify([]));
}
let ogrns = JSON.parse(readFileSync('./ogrns.json', 'utf-8') || []);

async function main(dir, result, config, callback, options) {
  const hash = getHash();

  const promises = [];

  const { type } = result;

  const data = result.data.filter((row, index) => {
    const ogrn = row['огрн'];

    if (!index || !ogrn) {
      return true;
    }

    return !(options.double && ogrns.includes(ogrn + options.customer));
  });

  data.forEach((row) => {
    const ogrn = row['огрн'];

    if (ogrn) {
      ogrns.push(ogrn + options.customer);
    }
  });

  const date = new Date();

  xlsx.fromFileAsync('./default.xlsx').then(async (workbook) => {
    Object.entries(config[type]).forEach(([key, value]) => {
      const headers = value
        .split(', ')
        .filter((item) => item)
        .map((header) => header?.toLowerCase());

      data
        .filter((row) => row['инн'] && row['телефон'])
        .forEach((row, index) => {
          if (row['телефон'] && index) {
            row['телефон'] = row['телефон'].toString().replace(/\D+/g, '');

            if (row['телефон'].length === 10) {
              row['телефон'] = `7${row['телефон']}`;
            }
            if (row['телефон'].length === 11) {
              const letters = row['телефон'].split('');

              if (letters[0] === '8') {
                letters[0] = 7;
              }

              row['телефон'] = letters.join('');
            }
            if (options.numberIsNumber) {
              row['телефон'] = +row['телефон'] || row['телефон'];
            }
          }

          if (row['инн'] && index) {
            row['инн'] = row['инн'].toString();

            row['инн'] =
              row['инн'].length === 11 || row['инн'].length === 9
                ? `0${row['инн']}`
                : row['инн'];
          }

          headers.forEach((header) => {
            if (allowBanks.includes(header)) {
              const promise = new Promise((resolve, reject) => {
                const inn = row['инн'].toString();

                bankRouter(header, {
                  phone: row['телефон'],
                  inn: inn.length === 11 || inn.length === 9 ? `0${inn}` : inn,
                })
                  .then((data) => {
                    workbook
                      .sheet(0)
                      .cell(`${key}${index + 1}`)
                      .value(index ? data.result : header);

                    resolve(data);
                  })
                  .catch(reject);
              });

              promises.push(promise);
            } else {
              if (row[header]) {
                workbook
                  .sheet(0)
                  .cell(`${key}${index + 1}`)
                  .value(row[header].toString());
              }
            }
          });
        });
    });

    console.log('PROMISE START');

    await Promise.all(promises);

    console.log('PROMISE END');

    const finalPatch = `./${dir}/${date.getDate()}.${
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    }.${type}.${hash}.xlsx`;

    logs(`Файл ${finalPatch} имеет ${data.length} строк`);

    mkdir(`./${dir}/`, { recursive: true }, async (error) => {
      await workbook.toFileAsync(finalPatch);

      callback(finalPatch);

      saveOgrns();
    });
  });
}

async function saveOgrns() {
  writeFileSync('./ogrns.json', JSON.stringify(ogrns));
}

export default main;
