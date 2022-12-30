import fetch from 'node-fetch';

export default async function check(inn, phone) {
  const result = await fetch('http://localhost:3101/check', {
    method: 'POST',

    headers: {
      authorization: 'ssssCKJ',
    },

    body: JSON.stringify({ inn: inn, phone: phone }),
  });

  console.log(inn, phone);

  return await result.json();
}
