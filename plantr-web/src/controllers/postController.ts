import { BaseContext } from 'koa';
import { Repository, getManager, Not, Equal } from 'typeorm';
import Post from '../models/post';
import { PostType } from '../common/postType';
import { ValidationError, validate } from 'class-validator';

export default class PostController {
  public static async getPosts(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);

    const posts: Post[] = await postRepository.find();

    ctx.status = 200;
    ctx.body = posts;
  }

  public static async getPost(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);

    const post: Post = await postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id: ctx.params.id })
      .getOne();

    if (post) {
      ctx.status = 200;
      ctx.body = post;
    } else {
      ctx.status = 400;
      ctx.body = `couldnt find the post with id ${ctx.params.id}`;
    }
  }

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

  public static async updatePost(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);

    const updatee: Post = await postRepository.findOne(ctx.params.id);

    if (!updatee) {
      ctx.status = 400;
      ctx.body = `the post with id ${ctx.params.id} doesnt exist`;
    }

    if (ctx.request.body.url) {
      updatee.url = ctx.request.body.url;
    }

    const validationErrors: ValidationError[] = await validate(updatee);
    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.body = validationErrors;
    } else if (!(await postRepository.findOne(updatee.id))) {
      ctx.status = 400;
      ctx.body = "The post you are trying to update doesn't exist in the db";
    } else if (
      await postRepository.findOne({
        id: Not(Equal(updatee.id)),
        url: updatee.url
      })
    ) {
      ctx.status = 400;
      ctx.body = 'The specified e-mail address already exists';
    } else {
      const user = await postRepository.save(updatee);
      ctx.status = 201;
      ctx.body = user;
    }
  }

  public static async deletePost(ctx: BaseContext) {
    const postRepository: Repository<Post> = getManager().getRepository(Post);

    const deletee: Post = await postRepository.findOne(ctx.params.id);

    if (!deletee) {
      ctx.status = 400;
      ctx.body = `couldn't find user with id ${ctx.params.id}`;
    } else {
      await postRepository.remove(deletee);
      ctx.status = 204;
    }
  }
}
