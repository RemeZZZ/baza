import express from 'express';
import { managerAuth, adminAuth } from '../middlewares/auth.js';
import { onLogin } from '../controllers/login.js';
import config from '../controllers/configs.js';
import { restartTgClient } from '../controllers/tgClient.js';
import { scorring } from '../controllers/scorring.js';

const {
  getDefaultConfig,
  getUsersConfig,
  getReplaceConfig,
  setDefaultConfig,
  getTargetsConfig,
  setTargetsConfig,
  setReplaceConfig,
} = config;

const router = express.Router();

router.get('/scorring', scorring);

router.post('/login', onLogin);

router.use(managerAuth);

router.get('/targetsConfig', getTargetsConfig);
router.post('/setTargetsConfig', setTargetsConfig);

router.use(adminAuth);

router.get('/restartTgClient', restartTgClient);

router.get('/defaultConfig', getDefaultConfig);
router.get('/usersConfig', getUsersConfig);
router.get('/replaceConfig', getReplaceConfig);

router.post('/setDefaultConfig', setDefaultConfig);
router.post('/setReplaceConfig', setReplaceConfig);

router.get('/test', (req, res) => res.send('ok2'));

export default router;
