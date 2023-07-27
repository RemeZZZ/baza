import { getLead } from '../store/index.js';
import alphaOpen from '../xlsxEditor/banks/alphaOpen..js';
import vtbOpen from '../xlsxEditor/banks/vtbOpen.js';

export async function scorring(request, response) {
  const { id } = request.query;

  const lead = getLead(id);
  const companyInfo = {};

  Object.entries(lead).forEach(([key, value]) => {
    companyInfo[key] = value.toString();
  });

  if (!lead) {
    return response.status(404).send({ data: {} });
  }

  const vtbResult = await vtbOpen(companyInfo['инн']);
  const alphaResult = await alphaOpen(
    companyInfo['инн'],
    companyInfo['телефон'],
  );

  await response.send({
    vtb: vtbResult.result,
    alpha: alphaResult.result,
    name:
      lead['фио'] ||
      `${lead['фамилия'] || ''} ${lead['имя'] || ''} ${lead['отчество'] || ''}`,
  });
}
