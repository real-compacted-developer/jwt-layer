import { Router } from 'express';
import validationAPI from './validation';
import userAPI from './user';

const router = Router();

router.use('/', validationAPI);
router.use('/user', userAPI);

export default router;
