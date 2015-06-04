// Posts is the client-side Collection name
// posts is the server-side mongoDB
// the collection acts as an API into your Mongo database
// this allows you to write Mongo commands like Posts.insert() or Posts.update(), and they will make changes to the posts collection stored inside Mongo
// When you declare Posts = new Mongo.Collection('posts'); on the client, what you are creating is a local, in-browser cache of the real Mongo collection. When we talk about a client-side collection being a "cache", we mean it in the sense that it contains a subset of your data, and offers very quick access to this data
Posts = new Mongo.Collection('posts');

// access rules for Posts collection
Posts.allow({
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId;   // not not, basically casts to bool
    }
});