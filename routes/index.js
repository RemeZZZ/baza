import express from 'express';
import { managerAuth, adminAuth } from '../middlewares/auth.js';
import { onLogin } from '../controllers/login.js';
import config from '../controllers/configs.js';

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

router.post('/login', onLogin);

router.use(managerAuth);

router.get('/targetsConfig', getTargetsConfig);
router.post('/setTargetsConfig', setTargetsConfig);

router.use(adminAuth);

router.get('/defaultConfig', getDefaultConfig);
router.get('/usersConfig', getUsersConfig);
router.get('/replaceConfig', getReplaceConfig);

router.post('/setDefaultConfig', setDefaultConfig);
router.post('/setReplaceConfig', setReplaceConfig);

router.get('/test', (req, res) => res.send('ok2'));

export default router;
