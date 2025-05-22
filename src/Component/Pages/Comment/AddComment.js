
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

const API_BASE_URL = 'http://5.180.148.40:9001/api/case-man/v1';

const AddComment = ({ show, onClose, selectedResource }) => {
  const token = Cookies.get("accessToken");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [commentsArray, setCommentsArray] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rowId = selectedResource?.row_id || '';

  const getCommentList = useCallback(async () => {
    if (!rowId) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/comment/${rowId}`, {
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
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/comment/${rowId}`,
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
      const response = await axios.delete(`${API_BASE_URL}/comment/${rowId}`, {
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
    <div className="popup-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
      <Paper className="popup-container" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
          <Typography variant="h6">Comments</Typography>
          <IconButton onClick={onClose} size="small">
            &times;
          </IconButton>
        </Box>

        <Box sx={{ p: 2, height: '300px', overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : commentsArray.length > 0 ? (
            <List>
              {commentsArray.map((comment, index) => (
                <ListItem key={index} sx={{ borderBottom: '1px solid #f5f5f5' }}>
                  <ListItemText
                    primary={comment.comment}
                    sx={{ mr: 1 }}
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
        </Box>

        <Box component="form" onSubmit={handleAddComment} sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <TextField
            fullWidth
            label="Add New Comment"
            variant="outlined"
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Enter your comment"
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
          </Box>
        </Box>
      </Paper>

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