import alpha from './alpha.js';
import vtb from './vtb.js';
import otcritie from './otcritie.js';
import tinkov from './tinkov.js';

export const allowBanks = ['альфа', 'втб', 'тиньков', 'псб'];

export async function bankRouter(bankName, body) {
  if (!allowBanks.includes(bankName)) {
    return;
  }

  const companyInfo = {};

  Object.entries(body).forEach(([key, value]) => {
    companyInfo[key] = value.toString();
  });

  console.log(companyInfo);

  if (bankName === 'альфа') {
    return await alpha(companyInfo.inn, companyInfo.phone);
  }

  if (bankName === 'втб') {
    return await vtb(companyInfo.inn);
  }

  if (bankName === 'псб') {
    return await otcritie(companyInfo.inn);
  }

  if (bankName === 'тиньков') {
    return await tinkov(companyInfo.inn);
  }
}
