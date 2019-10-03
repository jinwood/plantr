import Router from 'koa-router';
import PostController from './controllers/postController';

export const router: Router = new Router();

//post
router.post('/post', PostController.createPost);
