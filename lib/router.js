// maps routes out for iron:router

Router.configure({
    // use the layout template in client/templates/application as default layout
    layoutTemplate: 'layout',
    // spinner to indicate loading, provided by iron:router
    loadingTemplate: 'loading',
    // subscribe to the publication function defined in server/publications.js
    // this means that for every route on the site, we want to subscribe to the posts publication
    // since we're defining our waitOn function globally at the router level, this sequence will only happen once
    // when a user first accesses your app. After that, the data will already be loaded in the browser's memory and
    // the router won't need to wait for it again
    // waitOn is provided by iron:router
    waitOn: function() { return Meteor.subscribe('posts'); }
});

// define a postsList route, and map it to the '/' path
// By default, Iron Router will look for a template with the same name as the route name
// it will even infer the name from the path you provide (not in the case of '/', though)
Router.route('/', {name: 'postsList'});