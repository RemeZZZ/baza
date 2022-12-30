const XlsxPopulate = require('xlsx-populate');
const getHash = require('./hash.js');
const fs = require('fs');
const logs = require('./logs.js');
const { getReplaceConfig } = require('../../store/index.js');

const existFile = fs.existsSync('./ogrns.json');

if (!existFile) {
  fs.writeFileSync('./ogrns.json', JSON.stringify([]));
}

const regions = JSON.parse(fs.readFileSync('./data.json'));
let ogrns = JSON.parse(fs.readFileSync('./ogrns.json', 'utf-8') || []);

async function main(dir, result, config, callback, options) {
  const hash = getHash();

  const { type } = result;

  const data = result.data.filter((row, index) => {
    const ogrnKey = getReplaceConfig()['ОГРН'].find((key) => row[key]);
    const ogrn = row[ogrnKey];

    if (!index || !ogrn) {
      return true;
    }

    return !(options.double && ogrns.includes(ogrn + options.customer));
  });

  data.forEach((row) => {
    const ogrnKey = getReplaceConfig()['ОГРН'].find((key) => row[key]);
    const ogrn = row[ogrnKey];

    if (ogrn) {
      ogrns.push(ogrn + options.customer);
    }
  });

  const date = new Date();

  XlsxPopulate.fromFileAsync('./default.xlsx').then(async (workbook) => {
    Object.entries(config[type]).forEach(async ([key, value]) => {
      const headers = value
        .split(', ')
        .filter((item) => item)
        .map((header) => header?.toLowerCase());

      data
        .filter((row) => {
          const existsInn = row['инн'];
          const existsPhone = getReplaceConfig()['Телефон'].some(
            (key) => row[key],
          );

          return existsInn && existsPhone;
        })
        .forEach((row, index) => {
          const ogrnKey = getReplaceConfig()['ОГРН'].find((key) => row[key]);
          const ogrn = row[ogrnKey]?.toString();

          if (
            !(
              data[0].hasOwnProperty('индекс') ||
              data[0].hasOwnProperty('адрес') ||
              data[0].hasOwnProperty('город')
            )
          ) {
            if (ogrn) {
              const region = ogrn[3] + ogrn[4];

              if (index === 0) {
                workbook
                  .sheet(0)
                  .cell(`G${index + 1}`)
                  .value('Адрес');
              } else {
                workbook
                  .sheet(0)
                  .cell(`G${index + 1}`)
                  .value(regions[region]);
              }
            }
          }

          getReplaceConfig()['Телефон'].forEach((item) => {
            if (row[item] && index) {
              row[item] = row[item].toString().replace(/\D+/g, '');

              if (row[item].length === 10) {
                row[item] = `7${row[item]}`;
              }
              if (row[item].length === 11) {
                const letters = row[item].split('');

                if (letters[0] === '8') {
                  letters[0] = 7;
                }

                row[item] = letters.join('');
              }
              if (options.numberIsNumber) {
                row[item] = +row[item] || row[item];
              }
            }
          });

          headers.forEach((header) => {
            if (row[header]) {
              workbook
                .sheet(0)
                .cell(`${key}${index + 1}`)
                .value(row[header].toString());
            }
          });
        });
    });

    const finalPatch = `./${dir}/${date.getDate()}.${
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    }.${type}.${hash}.xlsx`;

    logs(`Файл ${finalPatch} имеет ${data.length} строк`);

    await workbook.toFileAsync(finalPatch);

    callback(finalPatch);

    saveOgrns();
  });
}

async function saveOgrns() {
  fs.writeFileSync('./ogrns.json', JSON.stringify(ogrns));
}

//document.querySelector('#clear').addEventListener('click', () => {
//ogrns = [];

//saveOgrns();
//});

module.exports = main;
