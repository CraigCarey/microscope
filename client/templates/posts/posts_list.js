// dummy static data, to be replaced with a database later
var postsData = [
    {
        title: 'Introducing Telescope',
        url: 'http://sachagreif.com/introducing-telescope/'
    },
    {
        title: 'Meteor',
        url: 'http://meteor.com'
    },
    {
        title: 'The Meteor Book',
        url: 'http://themeteorbook.com'
    }
];

// postsList template helpers
Template.postsList.helpers({

    // postsList template helpers, returns postData
    posts: postsData
});