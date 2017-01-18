var config = require('../config.json');

import url from 'url';
import writeComment from './writeComments';
import readComments from './readComments';
import micro, {
    json,
    send,
    sendError,
} from 'micro';
import { slug } from './utils';
import urlPattern from 'url-pattern';

/**
 * handle POST requests
 */
async function postHandler(request) {
    const postParams = await json(request);
    const { pathname } = url.parse(request.url);

    var commentData = {
        userName: postParams.userName,
        userEmail: postParams.userEmail,
        componentId: slug(pathname),
        comment: postParams.comment,
        timestamp: new Date().getTime(),
        stateId: postParams.stateId,
        version: postParams.version
    };

    return await writeComment(commentData);
}

/**
 * handle GET requests
 */
async function getHandler(request) {
    const { pathname } = url.parse(request.url);
    var pattern = new urlPattern('(/:componentId)(/:stateId)(/:version)');
    var urlParams = pattern.match(pathname);

    return await readComments(urlParams);
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
        // Add CORS
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Content-Type', 'application/json');

        send(response, 200, await methodHandler(request));
    } catch (error) {
        sendError(request, response, error);
    }
});
const PORT = process.env.port || config.PORT || 3000;
server.listen(PORT);

console.log(`API listening on port: ${PORT}`);
