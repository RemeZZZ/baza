import xlsx from 'xlsx-populate';
import fs from 'fs';

async function main(dirs) {
  let headers = [];
  const list = [];

  for (const dir of dirs) {
    const workbook = await xlsx.fromFileAsync(dir);

    const table = workbook.sheet(0).usedRange().value();

    headers = table.shift();

    list.push(...table);
  }

  list.unshift(headers);

  const workbook = await xlsx.fromBlankAsync('./default.xlsx');

  const finalDir = dirs[0].replace('.xlsx', '_finally.xlsx');

  fs.writeFileSync('./j.json', JSON.stringify(list));

  await workbook.sheet(0).cell('A1').value(list);

  await workbook.toFileAsync(finalDir);

  return finalDir;
}

export default main;
