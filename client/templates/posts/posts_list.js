// removed, since we're now setting the data context at the route level
// have named the new data context 'posts', same as the helper, so we don't need to change
// the template helper

//// postsList template helpers
//Template.postsList.helpers({
//
//    // postsList template helper, returns postData
//    posts: function() {
//        // find() returns a cursor, which is a reactive data source
//        // When we tell Spacebars to iterate over the Posts.find() cursor, it knows to observe that cursor for changes
//        // We can use fetch() on that cursor to transform it into an array
//        // sort all ({}) by date submitted, most recent first (-1)
//        return Posts.find({}, {sort: {submitted: -1}});
//    }
//});


// select postList's .wrapper div inside the template's onRendered callback,
// and define a moveElement hook
Template.postsList.onRendered(function () {
    this.find('.wrapper')._uihooks = {
        moveElement: function (node, next) {
            var $node = $(node), $next = $(next);
            var oldTop = $node.offset().top;
            var height = $node.outerHeight(true);

            // find all the elements between next and node
            var $inBetween = $next.nextUntil(node);
            if ($inBetween.length === 0)
                $inBetween = $node.nextUntil(next);

            // now put node in place
            $node.insertBefore(next);

            // measure new top
            var newTop = $node.offset().top;

            // move node *back* to where it was before
            $node
                .removeClass('animate')
                .css('top', oldTop - newTop);

            // push every other element down (or up) to put them back
            $inBetween
                .removeClass('animate')
                .css('top', oldTop < newTop ? height : -1 * height)


            // force a redraw
            $node.offset();

            // reset everything to 0, animated
            $node.addClass('animate').css('top', 0);
            $inBetween.addClass('animate').css('top', 0);
        }
    }
});