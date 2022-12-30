const password = '323323dffdsfsdfjeifjkrnkgnfdjgndlw';

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (authorization !== password) {
    res.status(401).send('unauthorized');

    return;
  }

  return next();
};
