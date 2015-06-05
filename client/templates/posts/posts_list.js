// postsList template helpers
Template.postsList.helpers({

    // postsList template helper, returns postData
    posts: function() {
        // find() returns a cursor, which is a reactive data source
        // When we tell Spacebars to iterate over the Posts.find() cursor, it knows to observe that cursor for changes
        // We can use fetch() on that cursor to transform it into an array
        // sort all ({}) by date submitted, most recent first (-1)
        return Posts.find({}, {sort: {submitted: -1}});
    }
});