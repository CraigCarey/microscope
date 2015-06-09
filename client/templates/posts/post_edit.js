// see post_submit.js for comments
Template.postEdit.onCreated(function() {
    Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});


// two template event callbacks: submit and delete
Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        var errors = validatePost(postProperties);
        if (errors.title || errors.url) {
            return Session.set('postEditErrors', errors);
        }

        // Calling the Collection.update() Method
        // the $set operator replaces a set of specified fields while leaving the others untouched
        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
});