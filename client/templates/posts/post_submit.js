
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

        // insert post into db by calling a method on the server
        // Method name, args, callback (executes when Method is done)
        Meteor.call('postInsert', post, function(error, result) {

            // display the error to the user and abort
            if (error) {
                return alert(error.reason);
            }

            // show that post exists and route to existing post
            if (result.postExists) {
                alert('This link has already been posted');
            }

            // redirect browser to new post page if postInsert is successful
            Router.go('postPage', {_id: result._id});
        });
    }
});