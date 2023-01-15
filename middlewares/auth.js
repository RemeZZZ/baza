const adminPassword = '323323dffdsfsdfjeifjkrnkgnfdjgndlw';
const managerPassword = 'k6dsjgs1dfdsjf4sFFdbcssrffgb0j9n';

export function adminAuth(req, res, next) {
  const { authorization } = req.headers;

  if (authorization !== adminPassword) {
    res.status(401).send('unauthorized');

    return;
  }

  req.userType = 'admin';

  return next();
}

export function managerAuth(req, res, next) {
  const { authorization } = req.headers;

  if (authorization === adminPassword) {
    req.userType = 'admin';
  } else if (authorization === managerPassword) {
    req.userType = 'manager';
  } else {
    res.status(401).send('unauthorized');

    return;
  }

  return next();
}
