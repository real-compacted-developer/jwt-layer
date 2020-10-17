import { Router } from 'express';
import validationAPI from './validation';

const router = Router();

router.use('/', validationAPI);

export default router;
