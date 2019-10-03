import { BaseContext } from 'koa';
import { Repository, getManager, Not, Equal } from 'typeorm';
import Plant from '../models/plant';
import Post from '../models/post';
import { PostType } from '../common/postType';
import { ValidationError, validate } from 'class-validator';

export default class PlantController {
  public static async createPlant(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);
    const plantRepository: Repository<Plant> = getManager().getRepository(
      Plant
    );

    // check the post exists
    console.log(ctx.request.body.url);

    const post: Post = await postRepository.findOne({
      url: ctx.request.body.url
    });

    if (!post) {
      console.log('theres no post');
      // here we need to create a new post
      return;
    }

    const newPlant: Plant = new Plant();
    newPlant.count = ctx.request.body.count;
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
          console.log(`created vehicle with id ${n.id}`);
        });

        console.table(plant);

        ctx.status = 201;
        ctx.response.body = { plant };
      } catch (err) {
        ctx.status = 500;
        ctx.response.body = { err };
      }
    }
  }
}
