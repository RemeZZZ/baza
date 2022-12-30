const letters =
  'QWERTYUIOPASDFGHJKLZXCVBNMGFSDSKLEKFLENVEWNVWEOIQWWQVQQXZCMKIUJHY';

function main(count) {
  let hash = '';

  for (let i = 0; i < (count || 4); i++) {
    const random = Math.round(Math.random() * letters.length);

    hash += letters[random] || 'A';
  }

  return hash;
}

export default main;
