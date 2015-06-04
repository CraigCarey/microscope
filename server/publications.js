// once autopublish is removed, you need to manually publish data
// This then needs to be subscribed to in the client

Meteor.publish('posts', function() {
    return Posts.find();
});