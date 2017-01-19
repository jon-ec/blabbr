import firebase from './db';

export default function editComment(urlParams, comment = '') {
    try {
        var { componentId, commentId } = urlParams;

        var rowRef = firebase.database().ref('/comments/' + componentId +'/' + commentId);

        return rowRef.once('value').then(function(snapshot) {
            var commentData = snapshot.val();

            commentData.comment = comment;

            rowRef.set(commentData);

            return {
                "success": 1,
                "comment": commentData
            };
        });

    } catch (error) {
        console.error(error);
        return {
            "success": 0,
            "error":  "There was a problem updating the comment."
        };
    }
}