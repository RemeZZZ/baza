import xlsx from 'xlsx-populate';

async function main(dirs) {
  let headers = [];
  const list = [];

  for (const dir of dirs) {
    const workbook = await xlsx.fromFileAsync(dir);

    const table = workbook.sheet(0).usedRange().value();

    headers = table.shift();

    list.push(
      ...table.map((item) => {
        return item.map((item) => item?.toString());
      }),
    );
  }

  list.unshift(headers);

  const workbook = await xlsx.fromFileAsync('./default.xlsx');

  const finalDir = dirs[0].replace('.xlsx', '_finally.xlsx');

  await workbook.sheet(0).cell('A1').value(list);

  await workbook.toFileAsync(finalDir);

  return finalDir;
}

export default main;
