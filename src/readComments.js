import firebase from './db';

export default function readComments (componentId) {
    try {
        return firebase.database().ref('/comments/' + componentId).once('value').then(function(snapshot) {
            var allComments = snapshot.val();

            if (allComments === null) {
                return JSON.parse('{ "success": 0, "error":  "No comments found for this component." }');
            }
            return JSON.parse('{ "success": 1, "comments": ' + JSON.stringify(allComments) + ' }');
        });
    } catch (error) {
        var errorMsg = error ? JSON.stringify(error) : 'There was a problem reading the data from the database.';
        return JSON.parse('{ "success": 0, "error": ' + errorMsg + '}');
    }
}
