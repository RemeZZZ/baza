import fetch from 'node-fetch';

export default async function check(inn) {
  try {
    const result = await fetch('http://localhost:3102/check', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bhhghgltlttppp6643mm',
      },

      body: JSON.stringify({
        leads: [{ inn }],
      }),
    });

    const data = await result.json();

    return data.leads[0] || { result: 'хз' };
  } catch {}
}
