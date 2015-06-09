// postItem template's helpers
Template.postItem.helpers({

    // check if post belongs to current user
    ownPost: function() {
        return this.userId === Meteor.userId();
    },

    // domain's value is an anonymous function
    domain: function() {
        // create an empty anchor element
        var a = document.createElement('a');
        // get the current post's url (this is the object currently being acted upon)
        a.href = this.url;
        return a.hostname;
    }
});

// call a server method when the user clicks on the button
Template.postItem.events({
    'click .upvote': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    }
});