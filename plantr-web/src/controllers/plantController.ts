import { BaseContext } from 'koa';
import { Repository, getManager } from 'typeorm';
import Plant from '../models/plant';
import Post from '../models/post';
import { ValidationError, validate } from 'class-validator';

export default class PlantController {
  public static async getPlants(ctx: BaseContext) {
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );
    const plants: Plant[] = await plantRepository.find();

    ctx.status = 200;
    ctx.body = plants;
  }

  public static async getPlant(ctx: BaseContext) {
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );

    const plant: Plant = await plantRepository.findOne(ctx.params.id);

    if (plant) {
      ctx.status = 200;
      ctx.body = plant;
    } else {
      ctx.status = 400;
      ctx.body = `no plant found with id ${ctx.params.id}`;
    }
  }

  public static async createPlant(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );

    // check the post exists
    const post: Post = await postRepository.findOne({
      url: ctx.request.body.url
    });

    if (!post) {
      console.log('theres no post');
      // here we need to create a new post
      return;
    }

    const newPlant: Plant = new Plant();
    newPlant.email = ctx.request.body.email;
    newPlant.userName = ctx.request.body.userName;
    newPlant.donationMade = false; //change this once api call made to charity
    newPlant.post = post;

    const validationErrors: ValidationError[] = await validate(newPlant, {
      skipMissingProperties: true
    });
    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.response.body = { validationErrors };
    } else {
      try {
        const plant = plantRepository.save(newPlant).then(n => {
          console.log(`created plant with id ${n.id}`);
        });

        ctx.status = 201;
        ctx.response.body = { plant };
      } catch (err) {
        ctx.status = 500;
        ctx.response.body = { err };
      }
    }
  }
}
