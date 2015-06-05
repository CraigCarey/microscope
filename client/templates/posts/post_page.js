Template.postPage.helpers({
    comments: function() {
        // get all comments with postId
        // this is a post within the comments helper
        return Comments.find({postId: this._id});
    }
});