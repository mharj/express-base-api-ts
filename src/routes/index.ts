import {Router} from 'express';
import {route as helloWorldRoute} from './helloWorld';
const router = Router();

router.use('/hello', helloWorldRoute);

export const routes = router;
