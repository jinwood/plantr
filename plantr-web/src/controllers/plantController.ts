import { BaseContext } from 'koa';
import { Repository, getManager, Not, Equal } from 'typeorm';
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

  public static async updatePlant(ctx: BaseContext) {
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );

    const updatee: Plant = await plantRepository.findOne(ctx.params.id);

    if (!updatee) {
      ctx.status = 400;
      ctx.body = `the plant with id ${ctx.params.id} doesnt exist`;
    }

    if (ctx.request.body.userName) {
      updatee.userName = ctx.request.body.userName;
    }
    if (ctx.request.body.email) {
      updatee.email = ctx.request.body.email;
    }

    const validationErrors: ValidationError[] = await validate(updatee);
    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.body = validationErrors;
    } else if (!(await plantRepository.findOne(updatee.id))) {
      ctx.status = 400;
      ctx.body = "The plant you are trying to update doesn't exist in the db";
    } else {
      const user = await plantRepository.save(updatee);
      ctx.status = 201;
      ctx.body = user;
    }
  }

  public static async deletePlant(ctx: BaseContext) {
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );

    const deletee: Plant = await plantRepository.findOne(ctx.params.id);

    if (!deletee) {
      ctx.status = 400;
      ctx.body = `couldn't find user with id ${ctx.params.id}`;
    } else {
      await plantRepository.remove(deletee);
      ctx.status = 204;
    }
  }
}
