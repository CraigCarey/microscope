
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

        // insert post into db and obtain generated id from return value
        post._id = Posts.insert(post);

        // redirect browser after all else is done
        Router.go('postPage', post);
    }
});