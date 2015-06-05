Notifications = new Mongo.Collection('notifications');

Notifications.allow({

    // The user making the update call owns the notification being modified.
    // The user is only trying to update a single field.
    // That single field is the read property of our notifications.
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) &&
            fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

// looks at the post that the user is commenting on,
// discovers who should be notified from there, and inserts a new notification
createCommentNotification = function(comment) {

    var post = Posts.findOne(comment.postId);

    if (comment.userId !== post.userId) {
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};