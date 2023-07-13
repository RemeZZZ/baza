import xlsx from 'xlsx-populate';

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

  const workbook = await xlsx.fromFileAsync('./default.xlsx');

  await workbook.sheet(0).cell('A1').value(list);

  await workbook.toFileAsync(`finally_${dirs[0]}`);

  return `finally_${dirs[0]}`;
}

export default main;
