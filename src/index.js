require("babel-polyfill");

// Set up Firebase
import * as firebase from "firebase";
var config = require('../config.json');

firebase.initializeApp(config);

// create helper functions
function writeComment(commentData) {
    // Get a key for a new Comment.
    var newCommentsKey = firebase.database().ref().child('comments').push().key;

    // Write the new comments's data simultaneously in the comments list and the user's comments list.
    var updates = {};
    updates['/comments/' + commentData.componentId + '/' + commentData.version + '/'  + newCommentsKey] = commentData;
    // updates['/user-comments/' + commentData.userName + '/' + commentData.componentId + '/' + commentData.version + '/' + newCommentsKey] = commentData;

    try {
        firebase.database().ref().update(updates);
        return JSON.parse('{ "success": 1 }');
    } catch (error) {
        var errorMsg = error ? JSON.stringify(error) : 'There was a problem writing the data to the database.';
        return JSON.parse('{ "success": 0, "error": ' + errorMsg + '}');
    }

}

function readComments (componentId) {
    try {
        return firebase.database().ref('/comments/' + componentId).once('value').then(function(snapshot) {
            var allComments = snapshot.val();

            if (allComments === null) {
                return JSON.parse('{ "success": 0, "error":  "No comments found for this component." }');
            }
            return JSON.parse('{ "success": 1, "comments": ' + JSON.stringify(allComments) + ' }');
        });
    } catch (error) {
        console.log(error);
        var errorMsg = error ? JSON.stringify(error) : 'There was a problem reading the data from the database.';
        return JSON.parse('{ "success": 0, "error": ' + errorMsg + '}');
    }
}


// create microservice
import url from 'url';

import micro, {
    json,
    send,
    sendError,
} from 'micro';

/**
 * handle POST requests
 */
async function postHandler(request) {
    const postParams = await json(request);
    const { pathname } = url.parse(request.url);

    var commentData = {
        userName: postParams.userName,
        userEmail: postParams.userEmail,
        componentId: pathname,
        comment: postParams.comment,
        timestamp: new Date().getTime()
    };

    return await writeComment(commentData);
}

/**
 * handle GET requests
 */
async function getHandler(request) {
    const { pathname } = url.parse(request.url);
    return await readComments(pathname);
}

/**
 * Check the request method and use postHandler or getHandler (or other method handlers)
 */
async function methodHandler(request, response) {
    try {
        switch (request.method) {
            case 'POST':
                return await postHandler(request);
            case 'GET':
                return await getHandler(request);
            default:
                send(response, 405, 'Invalid method');
                break;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * our micro service, run methodHandler and send result as a response (or an error)
 */
const server = micro(async function (request, response) {
    try {
        send(response, 200, await methodHandler(request));
    } catch (error) {
        sendError(request, response, error);
    }
});
const PORT = process.env.port || config.PORT || 3000;
server.listen(PORT);

console.log(`API listening on port: ${PORT}`);
