import fetch from 'node-fetch';

export default async function check(inn, phone) {
  const result = await fetch('http://localhost:3101/check', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      authorization: 'ssssCKJ',
    },

    body: JSON.stringify({ inn: inn, phone: phone }),
  });

  console.log('alpha', inn, phone);

  return await result.json();
}
