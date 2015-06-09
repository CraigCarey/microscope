// once autopublish is removed, you need to manually publish data
// This then needs to be subscribed to in the client

Meteor.publish('posts', function(options) {

    // validate options
    check(options, {
        // accept any object, in our case: {limit: postsLimit}
        sort: Object,
        limit: Number
    });

    // apply options to all ({}) Posts
    return Posts.find({}, options);
});

// overcomes not found error introduced after implementing pagination
Meteor.publish('singlePost', function(id) {
    check(id, String);
    return Posts.find(id);
});

Meteor.publish('comments', function(postId) {
    check(postId, String);
    return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
});