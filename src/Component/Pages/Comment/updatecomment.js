import { useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';


const UpdateComment = ({ onClose, comment, resourceId, GetCommentList }) => {
  const [newComment, setNewComment] = useState(comment.comment || "");
  const token = Cookies.get("accessToken");
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("Updated", comment)
      const response = await axios.put(`http://5.180.148.40:9001/api/case-man/v1/comment/${resourceId}`,
        {
          comment_id: comment.id,
          comment: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Updated", comment);
      toast.success("Update comment  successfully");
      GetCommentList()
      console.log("Updated Comment:", response.data);
      onClose()

    } catch (error) {
      toast.error("Error while updating comment");
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  return (


    <div className="popup-overlay" style={{ padding: '150px 100px 0px 0px' }}>
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <div className="popup-content">
          <form onSubmit={handleUpdate}>

            <label htmlFor="title">Update Comment:</label>
            <input
              className="com"
              type="text"
              id="title"
              name="title"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment"
              required
            />

            <div className="button-container">
              <button type="submit" className="create-btn">Update</button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default UpdateComment