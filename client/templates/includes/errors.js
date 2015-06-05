// gets errors from client/helpers/errors.js/Errors collection and displays then removes them

Template.errors.helpers({
    errors: function() {
        return Errors.find();
    }
});

// remove errors after they've been displayed
Template.error.onRendered(function() {

    // 'this.data' gives us access to the data of the object that is currently being rendered
    var error = this.data;

    // callback fx is executed after timeOut
    Meteor.setTimeout(function () {
        Errors.remove(error._id);
    }, 3000);
});