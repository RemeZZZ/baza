import xlsx from 'xlsx-populate';
import fs from 'fs';

import { getReplaceConfig, setLead } from '../../store/index.js';
import hash from './hash.js';

const regions = JSON.parse(fs.readFileSync('./data.json'));
function main(dir, callback) {
  const replaceConfig = getReplaceConfig();

  xlsx.fromFileAsync(dir).then((workbook) => {
    const table = workbook.sheet(0).usedRange().value();

    table[0] = table[0]
      .map((key, index) => {
        if (!key) {
          const isPhone = /^[\d\+][\d\(\)\ -]{4,14}\d$/.test(table[1][index]);

          if (isPhone) return 'Телефон';
        }
        return key;
      })
      .map((cell) => {
        const key = Object.entries(replaceConfig).find(([key, value]) => {
          return value.some(
            (item) => item.toLowerCase() === cell?.toLowerCase(),
          );
        });

        if (key) {
          return key[0]?.toLowerCase();
        }

        return cell?.toLowerCase();
      });

    const header = table[0];

    const data = table.reduce((rows, row, index) => {
      const resultRow = row.reduce((cells, cell, cellIndex) => {
        const key = header[cellIndex];

        if (cells[key]) {
          return cells;
        }

        cells[key] = cell;

        return cells;
      }, {});

      const ogrn = resultRow['огрн']?.toString();

      if (
        !(
          resultRow.hasOwnProperty('индекс') ||
          resultRow.hasOwnProperty('адрес') ||
          resultRow.hasOwnProperty('город')
        )
      ) {
        if (ogrn) {
          const region = ogrn[3] + ogrn[4];

          if (index === 0) {
            resultRow['адрес'] = 'Адрес';
          } else {
            resultRow['адрес'] = regions[region];
          }
        }
      }

      const hash20 = hash(20);

      resultRow[
        'ссылка_скорринг'
      ] = `http://zayavka-rko.ru/scorring?id=${hash20}`;

      if (index === 0) {
        resultRow['ссылка_скорринг'] = 'ссылка_скорринг';
      }

      //setLead(hash20, resultRow);

      rows.push(resultRow);

      return rows;
    }, []);

    const tfile = dir.split('\\').pop();
    const cfile = tfile.split('.');

    cfile.shift();

    const file = cfile.join('.');

    let fileType = '10';

    if (file.toUpperCase().indexOf('ЮЛ') !== -1) fileType = '01';
    if (file.toUpperCase().indexOf('ЮЛ') === -1 && file[0] !== '0')
      fileType = '10';
    if (file.toUpperCase().indexOf('ТАТ') !== -1) {
      fileType = 'TAT';
    }

    const newReg = header.includes('огрн') ? false : 'ПредНовоРег';

    const type = +data[1]['инн'] > 10000000000 ? 'ИП' : 'ООО';

    console.log(data);

    callback({
      fileType: fileType,
      type: newReg || type,
      legalType: type,
      data: data,
    });
  });
}

export default main;
