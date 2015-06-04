// postItem template's helpers
Template.postItem.helpers({

    // domain's value is an anonymous function
    domain: function() {
        // create an empty anchor element
        var a = document.createElement('a');
        // get the current post's url (this is the object currently being acted upon)
        a.href = this.url;
        return a.hostname;
    }
});