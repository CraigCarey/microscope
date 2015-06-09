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
        return [Meteor.subscribe('notifications')]
    }

});

// define a postsList route, and map it to the '/' path
// By default, Iron Router will look for a template with the same name as the route name
// it will even infer the name from the path you provide (not in the case of '/', though)
//Router.route('/', {name: 'postsList'});

// post page route
// The special :_id syntax tells the router two things:
// first, to match any route of the form /posts/xyz/, where “xyz” can be anything at all
// Second, to put whatever it finds in this “xyz” spot inside an _id property in the router's params array
Router.route('/posts/:_id', {
    name: 'postPage',
    // subscribe to comments on route selection, passing this.params._id as an argument to the subscription
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('comments', this.params._id)
            ];
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
    waitOn: function () {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});

// post submission page
Router.route('/submit', {name: 'postSubmit'});


// Create our controller by extending iron:router's RouteController
PostsListController = RouteController.extend({
    template: 'postsList',  // assign the template
    increment: 5,           // add an increment property

    // returns the current post number limit, by parsing the url
    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },

    // returns the options we'll use to extract n posts from Collection
    findOptions: function() {
        return {sort: {submitted: -1}, limit: this.postsLimit()};
    },

    // hook to avoid launching loading screen, which returns user back to top of list
    subscriptions: function () {
        this.postsSub = Meteor.subscribe('posts', this.findOptions());
    },

    // removed on addition of subscriptions hook
    // waitOn and data (now posts) are similar to how we used them in 'Router.route('/:postsLimit?..'
    // except now we are reusing findOptions - DRY
    //waitOn: function() {
    //    return Meteor.subscribe('posts', this.findOptions());
    //},

    // get posts that meet criteria in findOptions
    posts: function() {
      return Posts.find({}, this.findOptions());
    },

    // being called 3 times per page load, why is this?
    data: function() {
        // this.post refers to the current cursor, so count refers to n of posts in cursor
        // false when limit > count
        var hasMore = this.posts().count() === this.postsLimit();

        console.log("posts.count(): " + this.posts().count());
        console.log("postsLimit(): " + this.postsLimit());

        // build a new path using a javascript object, which uses postsLimit parameter
        var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});

        return {
            posts: this.posts(),

            // passing a flag to tell the template when the post subscription is done loading
            ready: this.postsSub.ready,
            nextPath: hasMore ? nextPath : null
        };
    }
});

// ':postsLimit?' means that there is an optional parameter that can be passed to the template
// this will be applied to every path after this is defined, so it needs to be the last route
Router.route('/:postsLimit?', {
    name: 'postsList'
    //,
    //waitOn: function() {
    //    // get the num of posts to show from url, or post 5
    //    var limit = parseInt(this.params.postsLimit) || 5;
    //    // subscribe with options (via publications.js), most recent first, only send limit
    //    return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
    //},
    //
    //// set the data context at the router level, rather than at the template helper level
    //// (since we're subscribing at this level above)
    //// instead of using 'this'
    //data: function() {
    //    var limit = parseInt(this.params.postsLimit) || 5;
    //    return {
    //        // return a named data context, called posts
    //        // inside the template, instead of using 'this', the data context will be available as 'posts'
    //        posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
    //    };
    //}
});


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