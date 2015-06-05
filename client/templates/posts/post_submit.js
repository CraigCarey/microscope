// use the Session to store an object containing potential error messages
// this will change as the user interacts with the form, which will in turn reactively update the form markup & contents
// initialise the object when form is created to clear old error messages
Template.postSubmit.onCreated(function() {
    Session.set('postSubmitErrors', {});
});

// two template helpers that look at the field property of the above object
Template.postSubmit.helpers({

    // just returns the message itself
    errorMessage: function(field) {
        return Session.get('postSubmitErrors')[field];
    },

    // checks for the presence of a message and returns has-error if such a message exists
    errorClass: function (field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});


Template.postSubmit.events({

    // best to use the submit event (rather than say a click event on the button),
    // as that will cover all possible ways of submitting (such as hitting enter)
    'submit form': function(e) {

        // stop browser from trying to submit the form the default way
        e.preventDefault();

        // create post object using form inputs, provided by event args ('e')
        var post = {
            // uses jQuery to parse out the values, hence the $ prefix
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        // check post for errors
        var errors = validatePost(post);
        if (errors.title || errors.url) {
            // using return to abort the execution of the helper if any errors are present,
            // not because we want to actually return this value anywhere
            return Session.set('postSubmitErrors', errors);
        }

        // insert post into db by calling a method on the server
        // Method name, args, callback (executes when Method is done)
        Meteor.call('postInsert', post, function(error, result) {

            // display the error to the user and abort
            if (error) {
                //return alert(error.reason); // ugly method
                return throwError(error.reason);
            }

            // show that post exists and route to existing post
            if (result.postExists) {
                throwError('This link has already been submitted');
            }

            // redirect browser to new post page if postInsert is successful
            Router.go('postPage', {_id: result._id});
        });
    }
});