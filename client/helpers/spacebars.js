// Template.registerHelper allows creation of a global helper that can be used
// within any template
Template.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});