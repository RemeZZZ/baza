import xlsx from 'xlsx-populate';
import fetch from 'node-fetch';
import { getTargetsConfig } from '../../store/index.js';

export async function sendLeads(xlsxFileDir, tags = 'Тег не найден') {
  const table = await xlsxFileParser(xlsxFileDir);

  const targets = getTargetsConfig().reduce((array, item) => {
    if (item.active) {
      array.push(item);
    }

    return array;
  }, []);

  try {
    fetch('http://localhost:4101/sendLeads', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        authorization: 'cvfgfhhrefgh2nc',
      },

      body: JSON.stringify({
        leads: table,
        tags: tags.split(', '),
        targets: targets,
      }),
    });
  } catch {}
}

async function xlsxFileParser(dir) {
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
      const region = item['инн'] ? `${item['инн'][0]}${item['инн'][1]}` : '';

      const row = {
        name:
          item['фио'] ||
          `${item['фамилия'] || ''} ${item['имя'] || ''} ${
            item['отчество'] || ''
          }`,

        orgName:
          item['наименование юл'] ||
          item['название юл'] ||
          item['название компании'] ||
          '',
        phones: [item['телефон']],
        address: item['адрес'] || item['регион'] || region,
        inn: item['инн'],
        ogrn: item['огрн'],
        otcritie: item['открытие'] || 'хз',
        tinkov: item['тиньков'] || item['тиньковт'] || 'хз',
        alpha: item['альфа'] || 'хз',
        vtb: item['втб'] || 'хз',
      };

      array.push(row);

      return array;
    }, []);
}
