const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const xlsxEditor = require('./xlsxEditor/index.js');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Подключаем логгер запросов
app.use(requestLogger);

app.use(cors);

app.use(router);

app.use(errorLogger);

app.listen(3001, () => {
  console.log('App listening on port 3001');
});

xlsxEditor.start();
