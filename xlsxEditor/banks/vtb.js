import fetch from 'node-fetch';

const promisesQueue = [];

export default async function check(inn) {
  return new Promise((resolve) => {
    promisesQueue.push({
      id: inn,
      end: resolve,
    });

    setTimeout(() => {
      if (promisesQueue.some((item) => item.end === resolve)) {
        resolve({
          result: 'Хз',
        });
      }
    }, 120 * 1000);
  });
}

setInterval(async () => {
  if (!promisesQueue.length) {
    return;
  }

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

  if (result.leads) {
    result.leads.forEach((lead) => {
      const index = promisesQueue.findIndex((item) => item.inn === lead.inn);

      const promise = promisesQueue[index];

      if (promise) {
        promise.end();

        array.splice(index, 1);
      }
    });
  }
}, 10 * 1000);
