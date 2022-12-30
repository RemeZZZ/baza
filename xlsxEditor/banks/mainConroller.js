import alpha from './alpha.js';

export const allowBanks = ['альфа'];

export async function bankRouter(bankName, companyInfo) {
  if (!allowBanks.includes(bankName)) {
    return;
  }

  if (bankName === 'альфа') {
    return await alpha({ inn: companyInfo.inn, phone: companyInfo.phone });
  }
}
