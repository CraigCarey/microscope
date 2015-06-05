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

// multiple denies, only 1 needs to be true
Posts.deny({
    // prevent user from editing certain properties of a post
    // i.e. user should not be able to assign a poster to someone else
    update: function(userId, post, fieldNames) {
        // using Underscore's without() Method to return a sub-array containing the fields that are not url or title
        // If everything's normal, that array should be empty and its length should be 0
        // so it'll return true for failed edit attempts, and deny the update
        // may only edit the following two fields:
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Posts.deny({
    // prevents updates if there's errors present
    update: function(userId, post, fieldNames, modifier) {
        // This works because modifier.$set contains the same two title and url property as the whole post object would
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});


// checks posts for errors
validatePost = function (post) {

    var errors = {};

    if (!post.title) {
        errors.title = "Please fill in a headline";
    }

    if (!post.url) {
        errors.url =  "Please fill in a URL";
    }

    return errors;
}


// When things are relatively straightforward and you can adequately express your rules via allow and deny, it's
// usually simpler to do things directly from the client.
// However, as soon as you start needing to do things that should be outside the user's control (such as timestamping
// a new post or assigning it to the correct user), it's probably better to use a Method

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

        // check for errors before posting, using the validatePost fx above
        var errors = validatePost(postAttributes);
        if (errors.title || errors.url) {
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
        }

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
            submitted: new Date(),
            commentsCount: 0
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