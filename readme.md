##Project Idea
- App which will allow for dynamic forum posting and real-time chat of online users

##Project Scope
- Users will need to be logged in to see and interact with site content
  - project stretch goal: create private groups or use of site is by invitation only
- Users will be able to see other user’s account profiles, but only be able to modify their own
  - project stretch goal: use ajax/client side script for users to modify their own account and profiles w/out page refresh
- Users will be able create posts and comments and modify and delete their own
  - project stretch goal: use ajax/client side script for users to crud their own comments w/out page refresh
- Users will see real-time chat they can contribute to on each page
  - project stretch goal: users will be able to open the chat in a new window and/or disable the chat portion on the page (if it will be featured on every page)
- Users will be able to see who else is currently logged in
  - project stretch goal: users will be able to have direct message chat w/ another user or group of users

###Project API/Module Highlights
- [Avatars.io](http://avatars.io/) - allow users to upload their own avatar
- [Socket.io](http://socket.io/) - integrate real-time features
- [ejs](https://www.npmjs.com/package/ejs) - view engine

###Project Stretch Goals
- users can save links to posts (and forums too?) to a "favorites"-type list
- allow some users to be admins to set a message loaded on every page or feature a particular post(s)
  - admins can make new forums
  - admins can make other users admins as well

##Models
###User
1. username (required, unique, length imitations)
2. email (required, unique)
3. password (bcrypted, minlength, required)
4. avatar link (use of avatars.io api)
  - default avatar if not provided (to be handled in views)
5. personal comment (maxlength, for display on their posts/comments)
  - user model stretch goal: allow richer personal comment w/ html and/or images/links?
6. created (date, now)
7. posts (array of schema ids to user’s posts)
8. comments (array of schema ids to user’s comments)

#####Schema hooks
- pre-save:
  - bcrypt pw if new or modified
  - static method: authenticate user
  - class method: check password
- pre-remove:
  - delete user's child posts
  - delete user's child comments

###Forum
*preset forums or only to be modified by site admin (stretch goal)*

1. name (required, unique)
2. created (date, now)
3. last activity (date of most recent post or comment)
4. last activity by user (user who made most recent activity)
4. posts (array of schema id to child posts)

#####Schema hooks
- pre-remove:
  - delete child posts

###Post
1. title (required, maxlength, unique?)
2. content (required, maxlength?)
3. created (date, now)
4. last updated (date)
6. last activity (date)
7. last activity user (user who most recently had activity on the post or its comments)
8. forum (schema id to parent forum)
9. user (schema id to user)
10. comments (array of schema id to child comments)

#####Schema hooks
- pre-remove:
  - delete child comments from db
  - delete reference to this post from parent user
  - delete reference to this post from parent forum
- pre-save/update:
  - update forum last updated
  - update forum last activity user

###Comment
1. content (required, maxlength?)
2. created (date, now)
3. last updated (date)
4. user (schema id to user)
5. post (schema id to parent post)

#####Schema hooks
- pre-remove:
  - delete reference to this comment from parent post
  - delete reference to this comment from parent user
- pre-save/update:
  - update post last activity
  - update forum last updated
  - update forum last activity user

