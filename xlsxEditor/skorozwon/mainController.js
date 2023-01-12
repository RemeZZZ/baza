import xlsx from 'xlsx-populate';
import fetch from 'node-fetch';
import { getTargetsConfig, getReplaceConfig } from '../../store/index.js';

export async function sendLeads(xlsxFileDir) {
  const table = await xlsxFileParser(xlsxFileDir);

  const targets = getTargetsConfig().reduce((array, item) => {
    if (item.active) {
      array.push(item.id);
    }

    return array;
  }, []);

  fetch('http://localhost:4101/sendLeads', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      authorization: 'cvfgfhhrefgh2nc',
    },

    body: JSON.stringify({
      leads: table,
      tags: ['тестовый5'],
      targets: targets,
    }),
  });
}

async function xlsxFileParser(dir) {
  const phonekeys = getReplaceConfig()['Телефон'];
  const ogrnkeys = getReplaceConfig()['ОГРН'];

  const workbook = await xlsx.fromFileAsync(dir);
  const table = workbook.sheet(0).usedRange().value();
  const headers = table.shift();

  return table
    .reduce((array, item) => {
      const row = item.reduce((row, item, index) => {
        const header = headers[index]?.toLowerCase();

        row[header] = item;

        return row;
      }, {});

      array.push(row);

      return array;
    }, [])
    .reduce((array, item) => {
      const phoneKey = phonekeys.find((key) => item[key]);
      const ogrnkey = ogrnkeys.find((key) => item[key]);

      const row = {
        name: `${item['фамилия']} ${item['имя']} ${item['отчество']}`,
        phones: [item[phoneKey]],
        address: item['адрес'],
        custom_fields: {
          FIELD_20000002891: item['инн'],
          FIELD_20000002460: item[ogrnkey],
          FIELD_20000002888: item['открытие'] || 'хз',
          FIELD_20000002887: item['тиньков'] || 'хз',
          FIELD_20000002886: item['альфа'] || 'хз',
          FIELD_20000002885: item['втб'] || 'хз',
        },
      };

      array.push(row);

      return array;
    }, []);
}
