import Router from 'koa-router';
import PostController from './controllers/postController';
import PlantController from './controllers/plantController';

export const router: Router = new Router();

//post
router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getPosts);
router.get('/posts/:id', PostController.getPost);
router.patch('/posts/:id', PostController.updatePost);
router.delete('/posts/:id', PostController.deletePost);

//plant
router.get('/plants', PlantController.getPlants);
router.get('/plants/:id', PlantController.getPlant);
router.post('/plants', PlantController.createPlant);
router.patch('/plants/:id', PlantController.updatePlant);
router.delete('/plants/:id', PlantController.deletePlant);
