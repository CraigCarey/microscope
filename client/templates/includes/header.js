Template.header.helpers({
    // for each navigation item, this helper class takes a list of route names and then uses
    // underscore's _.any() helper to see if any of the routes match the current path
    activeRouteClass: function(/* route names */) {
        // retrieve array of anonymous params from arguments object
        var args = Array.prototype.slice.call(arguments, 0);

        // get rid of the hash added at the end by Spacebars
        args.pop();

        var active = _.any(args, function(name) {
            // false && string = false
            // true && string = string
            return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    }
});