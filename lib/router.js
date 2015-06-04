// maps routes out for iron:router

Router.configure({
    // use the layout template in client/templates/application as default layout
    layoutTemplate: 'layout'
});

// define a postsList route, and map it to the '/' path
// By default, Iron Router will look for a template with the same name as the route name
// it will even infer the name from the path you provide (not in the case of '/', though)
Router.route('/', {name: 'postsList'});