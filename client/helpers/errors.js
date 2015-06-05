// this is a local collection, it will exist only in the browser, and will make no attempt to
// synchronize back to the server
// like all collections, it's reactive

// MongoDB collection name set to null (collection's data is never sent to server-side db)
Errors = new Mongo.Collection(null);

// call to add errors to collection
// don't need to worry about allow or deny or any other security concerns, as collection is “local” to the current user
throwError = function(message) {
    Errors.insert({message: message});
};