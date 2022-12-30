const password = '323323dffdsfsdfjeifjkrnkgnfdjgndlw';

module.exports.onLogin = (request, response) => {
  const { authorization } = request.headers;

  if (authorization === password) {
    response.status(200).send('auth');

    return;
  }

  response.status(401).send('fail');
};
