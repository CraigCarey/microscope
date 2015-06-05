Template.errors.helpers({
    errors: function() {
        return Errors.find();
    }
});

// remove errors after they've been displayed
Template.error.onRendered(function() {
    var error = this.data;

    // callback fx is executed after timeOut
    Meteor.setTimeout(function () {
        Errors.remove(error._id);
    }, 3000);
});