// maps routes out for iron:router

Router.configure({
    // use the layout template in client/templates/application as default layout
    layoutTemplate: 'layout',
    // spinner to indicate loading, provided by iron:router
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    // subscribe to the publication function defined in server/publications.js
    // this means that for every route on the site, we want to subscribe to the posts publication
    // since we're defining our waitOn function globally at the router level, this sequence will only happen once
    // when a user first accesses your app. After that, the data will already be loaded in the browser's memory and
    // the router won't need to wait for it again
    // waitOn is provided by iron:router
    waitOn: function() {
        return Meteor.subscribe('posts');
    }

});

// define a postsList route, and map it to the '/' path
// By default, Iron Router will look for a template with the same name as the route name
// it will even infer the name from the path you provide (not in the case of '/', though)
Router.route('/', {name: 'postsList'});

// post page route
// The special :_id syntax tells the router two things:
// first, to match any route of the form /posts/xyz/, where “xyz” can be anything at all
// Second, to put whatever it finds in this “xyz” spot inside an _id property in the router's params array
Router.route('/posts/:_id', {
    name: 'postPage',
    // subscribe to comments on route selection, passing this.params._id as an argument to the subscription
    waitOn: function() {
        return Meteor.subscribe('comments', this.params._id);
    },
    // data context based on the _id we got from the URL
    // findOne returns a single post that matches a query, and providing just an id as an argument is shorthand for {_id: id}
    // Within the data function for a route, this corresponds to the currently matched route, and we can use
    // this.params to access the named parts of the route (which we indicated by prefixing them with : inside our path)
    data: function() { return Posts.findOne(this.params._id); }
});

// post edit page, data context by post Id
Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
});

// post submission page
Router.route('/submit', {name: 'postSubmit'});


// route hook function, prevents access to certain routes unless logged in
var requireLogin = function() {
    if (! Meteor.user()) {
        // display loading screen while checking login status
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

// tells Iron Router to show the “not found” page not just for invalid routes but also for the postPage route,
// whenever the data function returns a “falsy” (i.e. null, false, undefined, or empty) object.
// leave at end of file
Router.onBeforeAction('dataNotFound', {only: 'postPage'});

// route hook, check logged in before allowing access to postSubmit
// routing hooks is that they too are reactive. This means we don't need to think about setting up callbacks
// when the user logs in: when the log-in state of the user changes, the Router's page template instantly changes
// from accessDenied to postSubmit without us having to write any explicit code to handle it (and by the way, this even
// works across browser tabs)
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});