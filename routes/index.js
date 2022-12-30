import express from 'express';
import auth from '../middlewares/auth.js';
import { onLogin } from '../controllers/login.js';
import config from '../controllers/configs.js';

const { getDefaultConfig, getUsersConfig, getReplaceConfig, setDefaultConfig } =
  config;

const router = express.Router();

router.post('/login', onLogin);

router.use(auth);

router.get('/defaultConfig', getDefaultConfig);
router.get('/usersConfig', getUsersConfig);
router.get('/replaceConfig', getReplaceConfig);

router.post('/setDefaultConfig', setDefaultConfig);

router.get('/test', (req, res) => res.send('ok2'));

export default router;
