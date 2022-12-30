const router = require('express').Router();
const auth = require('../middlewares/auth');
const { onLogin } = require('../controllers/login.js');
const {
  getDefaultConfig,
  getUsersConfig,
  getReplaceConfig,
  setDefaultConfig,
} = require('../controllers/configs.js');

router.post('/login', onLogin);

router.use(auth);

router.get('/defaultConfig', getDefaultConfig);
router.get('/usersConfig', getUsersConfig);
router.get('/replaceConfig', getReplaceConfig);

router.post('/setDefaultConfig', setDefaultConfig);

router.get('/test', (req, res) => res.send('ok2'));

module.exports = router;
