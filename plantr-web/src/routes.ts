import Router from 'koa-router';
import PostController from './controllers/postController';

export const router: Router = new Router();

//post
router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getPosts);
router.get('/posts/:id', PostController.getPost);
