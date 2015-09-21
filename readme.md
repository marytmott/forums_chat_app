###Project Idea
- App which will allow for dynamic forum posting and real-time chat of online users

###Project Scope
- Users will need to be logged in to see content
  - project stretch goal: create private groups or use of site is by invitation only
- Users will be able to create, edit and delete their own posts as well as see all posts
- Users will be able to see other user’s account profiles, but only be able to modify their own
- Users will be able create posts and comments and modify and delete their own
  - project stretch goal: use ajax/client side js script for users to crud their own comments w/out page refresh
- Users will see real-time chat they can join and contribute too on each page
  - project stretch goal: users will be able to open the chat in a new window and/or disable the chat portion on the page (if it will be featured on every page)
- Users will be able to see who else is currently logged in
  - project stretch goal: users will be able to have direct message chat w/ another user or group of users

- [Avatars.io](http://avatars.io/) api will be used to allow users to upload their own avatar
- [Socket.io](http://socket.io/) will be used to integrate real-time features

####Project Stretch Goals
- users can save main post links to a "favorites"-type list
- allow some users to be admins to set a message loaded on every page or feature a particular post(s)
  - admins can make new forums
  - user admins can make other uses admins as well

###Models
####User
1. username (required, unique, length imitations)
2. email (required, lowercase storage, unique)
3. password (bcrypted, minlength, required)
4. avatar link (use of avatar.io api)
5. personal comment (maxlength, for display on their posts/comments)
  - user model stretch goal: allow richer comment w/ html and/or images/links?
6. created (date, now)
7. posts (array of schema ids to user’s posts)
8. comments (array of schema ids to user’s comments)

- pre-save:
  - bcrypt pw if new or modified
  - static method: authenticate user
  - class method: check password
- pre-remove:
  - delete users child posts
  - delete users child comments

####Forum
*preset or only to be modified by site admin (stretch goal)*

1. title (required)
2. created (date, now)
3. last updated (date)
4. posts (array of schema id to child posts)

- pre-remove:
  - delete child posts

####Post
1. title (required, maxlength, unique?)
2. content (required, maxlength?)
3. created (date, now)
4. last updated (date)
5. forum (schema id to parent forum)
6. author (schema id to user)
7. comments (array of schema id to child comments)

- pre-remove:
  - delete child comments from db
  - delete reference to this post from parent user
  - delete reference to this post from parent forum

####Comment
1. content (required, maxlength?)
2. created (date, now)
3. last updated (date)
4. author (schema id to user)
5. post (schema id to parent post)

- pre-remove:
  - delete reference to this comment from parent post
  - delete reference to this comment from parent user

