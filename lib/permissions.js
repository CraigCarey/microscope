// since we're inside lib, this should be loaded first, and available on server and client

// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
}