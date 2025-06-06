
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Paper,
  Typography,
  TextField,
  Box,
  Button
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Cookies from 'js-cookie';
import UpdateComment from './updatecomment';

//const API_BASE_URL = `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1`;

const AddComment = ({ show, onClose, selectedResource }) => {
  const token = Cookies.get("accessToken");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rowId = selectedResource?.row_id || '';

  const [error, setError] = useState({});

  const validateForm = () => {
    const Errors = {};
    if (!newComment) {
      Errors.comment = "Please enter a comment before clicking the Add button.";
  }
  return Errors;
}
  const getCommentList = useCallback(async () => {
    if (!rowId) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/comment/${rowId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCommentsArray(res.data || []);
    } catch (err) {
      console.error("Fetch comment list error:", err);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [rowId, token]);

  useEffect(() => {
    if (show && rowId) {
      getCommentList();
    }
  }, [show, rowId, getCommentList]);

  if (!show) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/comment/${rowId}`,
        { comment: newComment.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("New comment added successfully");
      setNewComment('');
      getCommentList();
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const comment_id = id;
    try {
      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/comment/${rowId}`, {
        data: { comment_id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Comment deleted successfully");
        getCommentList();
      } else {
        console.error("Failed to delete comment:", response.status);
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleEditClick = (comment) => {
    setCommentToEdit(comment);
    setShowUpdatePopup(true);
  };

  const handleUpdateClose = () => {
    setShowUpdatePopup(false);
    setCommentToEdit(null);
  };

  return (
    <div className="popup-overlay" >
      <div className="popup-container">
   <div className="popup-content">
     <label htmlFor="title">Comments</label>
           <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : commentsArray.length > 0 ? (
            <List style={{minHeight:'auto',maxHeight:'400px',overflow:'auto'}}>
              {commentsArray.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={comment.comment}
                  
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => handleEditClick(comment)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" size="small" onClick={() => handleDelete(comment.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary" sx={{ textAlign: 'center', my: 2 }}>
              No comments found
            </Typography>
          )}
   <form onSubmit={handleAddComment}>
    <label htmlFor="title">Add Comment</label>
          <input
            className="com"
              type="text"
              id="title"
              name="title"
            value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setError((prevErrors) => ({
                  ...prevErrors,
                  comment: "",
                }));
            }}
            placeholder="Enter your comment"
          
          />
            {error.comment && <p style={{ color: "red", margin: '0px' }} >{error.comment}</p>}

          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !newComment.trim()}
              startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
            >
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </Button>
          </Box> */}

          <div className="button-container">
              <button type="submit" className="create-btn" disabled={isSubmitting || !newComment.trim()}> {isSubmitting ? 'Adding...' : 'Add'}</button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              </div>
           </form>
      </div>
</div>
      {showUpdatePopup && commentToEdit && (
        <UpdateComment
          show={showUpdatePopup}
          onClose={handleUpdateClose}
          comment={commentToEdit}
          resourceId={rowId}
          GetCommentList={getCommentList}
        />
      )}
    </div>
  );
};

export default AddComment;