import alpha from './alpha.js';

export const allowBanks = ['альфа'];

export async function bankRouter(bankName, companyInfo) {
  console.log(companyInfo);

  if (!allowBanks.includes(bankName)) {
    return;
  }

  if (bankName === 'альфа') {
    return await alpha(companyInfo.inn, companyInfo.phone);
  }
}
