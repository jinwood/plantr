# httpie commands

# get all posts
http GET http://localhost:4000/posts

# get a post
http GET http://localhost:4000/posts/{id}

# create post
http POST http://localhost:4000/posts/ url='https://old.reddit.com/r/plantr/comments/dcvw9p/test_post/'
