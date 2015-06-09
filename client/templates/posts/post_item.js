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
    },

    // helper function for disabling the upvote button
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    }
});

// call a server method when the user clicks on the upvote button
Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    }
});