// Posts is the client-side Collection name
// posts is the server-side mongoDB
// the collection acts as an API into your Mongo database
// this allows you to write Mongo commands like Posts.insert() or Posts.update(), and they will make changes to the posts collection stored inside Mongo
// When you declare Posts = new Mongo.Collection('posts'); on the client, what you are creating is a local, in-browser cache of the real Mongo collection. When we talk about a client-side collection being a "cache", we mean it in the sense that it contains a subset of your data, and offers very quick access to this data
Posts = new Mongo.Collection('posts');

// create doesn't need an allow method, since it calls a Method
Posts.allow({
    update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); },
});

// Methods run on server, called from client
Meteor.methods({

    // checks posts and user before inserting into db
    postInsert: function(postAttributes) {

        // ensure user is logged in by checking that userId is a string
        check(Meteor.userId(), String);

        // check post for validity: must contain a title and a url
        check(postAttributes, {
            title: String,
            url: String
        });

        // check if posts with same URL exist already
        var postWithSameLink = Posts.findOne({url: postAttributes.url});

        // if URL already exists, redirect user to existing post
        if (postWithSameLink) {
            return {
                // include flag to let client know that post existed already
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        // get current user
        var user = Meteor.user();

        // extend postAttributes object with more properties
        // _.extend() method is part of the Underscore library
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        // insert post into db and obtain generated id from return value
        var postId = Posts.insert(post);

        // return id to client in callback result property
        return {
            _id: postId
        };
    }
});

// removed since Meteor methods bypass allow. Functionality replaced above
// Meteor Methods are executed on the server, so Meteor assumes they can be trusted.
// As such, Meteor methods bypass any allow/deny callbacks.
//// access rules for Posts collection
//Posts.allow({
//    insert: function(userId, doc) {
//        // only allow posting if you are logged in
//        return !! userId;   // not not, basically casts to bool
//    }
//});