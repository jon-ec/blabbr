
import firebase from './db';

export default function writeComment(commentData) {
    try {
        // get reference to the table
        var tableRef = firebase.database().ref('/comments/' + commentData.componentId);

        // create a new row in the table
        var rowRef = tableRef.push();

        // write data to the new row, priority set to get comments in descending order
        rowRef.setWithPriority(commentData, 0 - commentData.timestamp);

        return {
            "success": 1,
            "comment": commentData
        };
    } catch (error) {
        console.error(error);
        return {
            "success": 0,
            "error":  "There was a problem writing the data to the database."
        };
    }
}