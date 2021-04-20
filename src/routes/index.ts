import {Router} from 'express';
import {route as helloWorldRoute} from './helloWorld';
import {route as statusRoute} from './status';
const router = Router();

router.use('/hello', helloWorldRoute);
router.use('/status', statusRoute);

export const routes = router;
