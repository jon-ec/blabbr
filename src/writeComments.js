
import firebase from './db';

export default function writeComment(commentData) {
    // Get a key for a new Comment.
    var newCommentsKey = firebase.database().ref().child('comments').push().key;

    // Write the new comments's data simultaneously in the comments list and the user's comments list.
    var updates = {},
        compVersion = commentData.version,
        component_version = compVersion ? slug(compVersion) : "1";

    updates['/comments/' + commentData.componentId + '/' + component_version + '/'  + newCommentsKey] = commentData;
    // updates['/user-comments/' + commentData.userName + '/' + commentData.componentId + '/' + commentData.version + '/' + newCommentsKey] = commentData;

    try {
        firebase.database().ref().update(updates);
        return JSON.parse('{ "success": 1 }');
    } catch (error) {
        console.log(error);
        var errorMsg = error ? JSON.stringify({ "error": error }) : 'There was a problem writing the data to the database.';
        return JSON.parse('{ "success": 0, "error": ' + errorMsg + '}');
    }
}

function slug(str) {
    return str.replace(/[^\w\s]/gi, '');
}