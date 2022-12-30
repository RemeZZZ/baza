import fetch from 'node-fetch';

export default async function check(inn, phone) {
  const result = await fetch('localhost:3101/check', {
    method: 'POST',

    headers: {
      authorization: 'ssssCKJ',
    },

    body: JSON.stringify({ inn, phone }),
  });

  return await result.json();
}
