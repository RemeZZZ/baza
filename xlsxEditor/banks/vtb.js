import fetch from 'node-fetch';

const promisesQueue = [];

export default async function check(inn) {
  return new Promise((resolve) => {
    promisesQueue.push({
      id: inn,
      end: resolve,
    });

    setTimeout(() => {
      const index = promisesQueue.findIndex((item) => item.id === inn);

      if (promisesQueue[index]) {
        promisesQueue[index].end({
          result: 'Хз',
        });

        promisesQueue.splice(index, 1);
      }
    }, 90 * 1000);
  });
}

setInterval(async () => {
  if (!promisesQueue.length) {
    return;
  }

  try {
    const result = await fetch('http://localhost:3102/check', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bhhghgltlttppp6643mm',
      },

      body: JSON.stringify({
        leads: promisesQueue.map((item) => {
          return {
            inn: item.id,
          };
        }),
      }),
    });

    const data = await result.json();

    if (data.leads) {
      data.leads.forEach((lead) => {
        const index = promisesQueue.findIndex(
          (item) => `${item.id}` === `${lead.inn}`,
        );

        const promise = promisesQueue[index];

        if (promise) {
          promise.end(lead);

          promisesQueue.splice(index, 1);
        }
      });
    }
  } catch {}
}, 50 * 1000);
