import fetch from 'node-fetch';

export default async function check(inn, phone) {
  setTimeout(() => {
    return { result: 'Хз' };
  }, 1000 * 60 * 10);
  try {
    const result = await fetch('http://localhost:3101/check', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        authorization: 'ssssCKJ',
      },

      body: JSON.stringify({ inn: inn, phone: phone }),
    });

    return await result.json();
  } catch {
    return { result: 'Хз' };
  }
}
