import firebase from './db';

export default function deleteComment(urlParams) {
    try {
        // get reference to the row
        var rowRef = firebase.database().ref('/comments/' + urlParams.componentId + '/' + urlParams.commentId);

        // remove row
        rowRef.remove();

        return {
            "success": 1,
            "comment": "Comment removed"
        };

    } catch (error) {
        console.error(error);
        return {
            "success": 0,
            "error":  "There was a problem deleting the data to the database."
        };
    }
}