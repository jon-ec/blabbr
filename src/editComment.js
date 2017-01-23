import firebase from './db';

export default function editComment(urlParams, postParams) {
    try {
        var { componentId, commentId } = urlParams;
        var { comment = '',
              approverName = '',
              approverEmail = '',
              approved = false } = postParams;
        var isApprovalRequest = postParams.approved !== undefined;
        var msg = '';
        var rowRef = firebase.database().ref('/comments/' + componentId +'/' + commentId);

        return rowRef.once('value').then(function(snapshot) {
            var commentData = snapshot.val();

            if (isApprovalRequest) {
              commentData.approverName = approverName;
              commentData.approverEmail = approverEmail;
              commentData.approvedDate = new Date().getTime();
              commentData.approved = approved;
              msg = approved ? "Your comment was approved successfully." : "Your comment has been unapproved.";
            } else {
              commentData.comment = comment;
              commentData.edited = true;
              commentData.lastUpdated = new Date().getTime();
              msg = "Your comment has been updated successfully.";
            }

            rowRef.setWithPriority(commentData, 0 - commentData.timestamp);

            return {
                "success": 1,
                "msg": msg,
                "comment": commentData
            };
        });

    } catch (error) {
        console.error(error);
        return {
            "success": 0,
            "msg":  "There was a problem updating the comment."
        };
    }
}
