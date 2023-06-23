import { getLead } from '../store/index.js';
import alphaOpen from '../xlsxEditor/banks/alphaOpen..js';
import vtbOpen from '../xlsxEditor/banks/vtbOpen.js';

export async function scorring(request, response) {
  const { id } = request.query;

  const lead = getLead(id);

  if (!lead) {
    return response.status(404).send({ data: {} });
  }

  const vtbResult = await vtbOpen(lead['инн']);
  const alphaResult = await alphaOpen(lead['инн'], lead['телефон']);

  await response.send({
    vtb: vtbResult.result,
    alpha: alphaResult.result,
    name:
      lead['фио'] ||
      `${lead['фамилия'] || ''} ${lead['имя'] || ''} ${lead['отчество'] || ''}`,
  });
}
