# httpie commands


#posts
# get all posts
http GET http://localhost:4000/posts
# get a post
http GET http://localhost:4000/posts/{id}
# create post
http POST http://localhost:4000/posts/ url='https://old.reddit.com/r/plantr/comments/dcvw9p/test_post/'
# update post
http PATCH http://localhost:4000/posts/ url='https://old.reddit.com/r/plantr/comments/dcvw9p/test_post/foobar'
# delete post
http DELETE http://localhost:4000/posts/{id}


#plants
# get all plants
http GET http://localhost:4000/plants
# get a plant

# create a plant
http POST http://localhost:4000/plants url='https://old.reddit.com/r/plantr/comments/dcvw9p/test_post/' email="julian@foo.com" userName="julian" 
