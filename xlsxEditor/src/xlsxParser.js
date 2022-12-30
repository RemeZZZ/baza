const XlsxPopulate = require('xlsx-populate');

const { getReplaceConfig } = require('../../store/index.js');

function main(dir, callback) {
  XlsxPopulate.fromFileAsync(dir).then((workbook) => {
    const table = workbook.sheet(0).usedRange().value();

    table[0] = table[0].map((key, index) => {
      if (!key) {
        const isPhone = /^[\d\+][\d\(\)\ -]{4,14}\d$/.test(table[1][index]);

        if (isPhone) return 'Телефон';
      }
      return key;
    });

    const header = table[0].map((cell) => cell?.toLowerCase());

    const data = table.reduce((rows, row) => {
      rows.push(
        row.reduce((cells, cell, cellIndex) => {
          const key = header[cellIndex];

          if (cells[key]) {
            cells[key];

            return cells;
          }

          cells[key] = cell;

          return cells;
        }, {}),
      );

      return rows;
    }, []);

    const tfile = dir.split('\\').pop();
    const cfile = tfile.split('.');

    cfile.shift();

    const file = cfile.join('.');

    let fileType = null;

    if (file[0] === '0') fileType = '01';
    if (file[0] !== '0') fileType = '10';
    if (file.split(' ')[1]?.replace('.xlsx', '').toUpperCase() === 'ТАТ') {
      fileType = 'TAT';
    }

    const newReg = getReplaceConfig()['ОГРН'].some((key) =>
      header.includes(key),
    )
      ? false
      : 'НОВОРЕГ';

    const type = +data[1]['инн'] > 10000000000 ? 'ИП' : 'ООО';

    callback({
      fileType: fileType,
      type: type,
      new: newReg,
      data: data,
    });
  });
}

module.exports = main;
