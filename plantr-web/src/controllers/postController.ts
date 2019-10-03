import { BaseContext } from 'koa';
import { Repository, getManager } from 'typeorm';
import Post from 'models/post';
import { PostType } from 'common/postType';
import { ValidationError, validate } from 'class-validator';

export default class PostController {
  public static async createPost(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);

    const newPost = new Post();
    newPost.url = ctx.request.body.url;
    newPost.type = PostType.Reddit;

    const validationErrors: ValidationError[] = await validate(newPost, {
      skipMissingProperties: true
    });

    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.body = validationErrors;
    } else if (await postRepository.findOne({ url: newPost.url })) {
      // what we actually need to do here is create a plant for the given post
      // also need an efficient way of normalising a reddit url to search for
      // an existing post
      ctx.status = 400;
      ctx.body = 'post already exists';
    } else {
      const post = await postRepository.save(newPost);
      ctx.status = 201;
      ctx.body = post;
    }
  }
}
