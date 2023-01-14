const adminPassword = '323323dffdsfsdfjeifjkrnkgnfdjgndlw';
const managerPassword = 'k6dsjgs1dfdsjf4sFFdbcssrffgb0j9n';

export function onLogin(request, response) {
  const { authorization } = request.headers;

  if (authorization === adminPassword) {
    response.status(200).send({
      path: '/admin',
    });

    return;
  }

  if (authorization === managerPassword) {
    response.status(200).send({
      path: '/manager',
    });

    return;
  }

  response.status(401).send({ message: 'fail' });
}
