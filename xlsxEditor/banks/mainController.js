import alpha from './alpha.js';
import vtb from './vtb.js';

export const allowBanks = ['альфа', 'втб'];

export async function bankRouter(bankName, companyInfo) {
  if (!allowBanks.includes(bankName)) {
    return;
  }

  if (bankName === 'альфа') {
    return await alpha(companyInfo.inn, companyInfo.phone);
  }

  if (bankName === 'втб') {
    return await vtb(companyInfo.inn);
  }
}
