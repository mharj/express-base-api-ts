import {Request, Response, Router} from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	res.json({msg: 'hello world'}).end();
});

export const route = router;
