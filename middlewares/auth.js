const password = '323323dffdsfsdfjeifjkrnkgnfdjgndlw';

export default (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (authorization !== password) {
    res.status(401).send('unauthorized');

    return;
  }

  return next();
};
