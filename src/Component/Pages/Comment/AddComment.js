import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Cookies from 'js-cookie';
import UpdateComment from './updatecomment';

const AddComment = ({ show, onClose, selectedResource }) => {
  // console.log("selsctedResource",selectedResource.row_id)
   const token = Cookies.get("accessToken");
   const [comments, setComments] = useState([]);
   const [showUpdatePopup, setShowUpdatePopup] = useState(false);
   const [commentToEdit, setCommentToEdit] = useState(null);
   const [commentsArray, setCommentsArray] = useState([]);
   
  //  const commentsArray = (
  //    selectedResource?.comments ? JSON.parse(selectedResource.comments) : []
  //  );
   const rowId = selectedResource?.row_id || '';

   console.log("rowid",rowId)
   const [newComment, setNewComment] = useState('');
   
   const GetCommentList = async () => {
    if (!rowId) return;
  try {
      const res = await axios.get(`http://5.180.148.40:9001/api/case-man/v1/comment/${rowId}`, 
       
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentsArray(res.data || []); 
      console.log("rsponeListComment",res)
      // toast.success("Add new comment Successfully");
     
    } catch (err) {
      console.error("Fecth List comment error:", err);
      toast.error("Failed to comment list");
    }
  };
  useEffect(() => {
        GetCommentList(); // Call the userData function
        }, [rowId]);
 
   if (!show) return null;
   
   const handleAddComment = async (e) => {
     e.preventDefault();
     if (!newComment.trim()) return;
 
     try {
       const res = await axios.post(`http://5.180.148.40:9001/api/case-man/v1/comment/${rowId}`, {
         comment: newComment.trim()},
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
         }
       );
       toast.success("Add new comment Successfully");
       setComments((prev) => [...prev, res.data]);
       setNewComment('');
       GetCommentList()
     } catch (err) {
       console.error("Add comment error:", err);
       toast.error("Failed to add comment");
     }
   };
   
   const handleDelete = async (id) => {
     const comment_id = id;
     try {
       const response = await axios.delete(`http://5.180.148.40:9001/api/case-man/v1/comment/${rowId}`, {
         data: { comment_id },
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       });
       GetCommentList()
       if (response.status === 200) {
         toast.success("Comment successfully deleted!");
       } else {
         console.error("Failed to delete item:", response.status);
       }
     } catch (error) {
       console.error("Error deleting item:", error);
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
     <div className="popup-overlay" style={{padding:'150px 100px 0px 0px'}}>
       <div className="popup-container">
         <button className="close-icon" onClick={onClose}>
           &times;
         </button>
         <div className="popup-content">
           <List className="bg-gray border-bottom" style={{ maxHeight: '300px', overflow: 'auto' }}>
             <label style={{marginLeft:'5px'}}>Comments</label>
             {commentsArray && commentsArray.length > 0 ? (
               commentsArray.map((comment, index) => (
                 <ListItem key={index} className="text-white">
                   <ListItemText 
                     primary={`${comment.comment}`}
                     style={{ cursor: 'default', marginRight: '5px', flexGrow:7, padding:'0 5px 0 5px' }}
                   />
                   <ListItemSecondaryAction>
                     <IconButton edge="end" color="dark">
                       <EditIcon 
                         style={{ cursor: 'pointer' }} 
                         onClick={() => handleEditClick(comment)} 
                       />
                     </IconButton>
                     <IconButton edge="end" color="dark" onClick={() => handleDelete(comment.id)}>
                       <DeleteIcon />
                     </IconButton>
                   </ListItemSecondaryAction>
                 </ListItem>
               ))
             ) : (
               <p className="text-gray-400 p-2">No comments found</p>
             )}
           </List>

           <form onSubmit={handleAddComment}>
             <label htmlFor="title">Add New Comment:</label>
             <input
               className="com"
               type="text"
               id="title"
               name="title"
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               placeholder="Enter Your Comment"
               required
             />
           
             <div className="button-container">
               <button type="submit" className="create-btn">
                 + Add
               </button>
               <button type="button" className="cancel-btn" onClick={onClose}>
                 Cancel
               </button>
             </div>
           </form>
         </div>
       </div>
       
       {/* Update Comment Popup */}
       {showUpdatePopup && commentToEdit && (
         <UpdateComment 
           show={showUpdatePopup} 
           onClose={handleUpdateClose} 
           comment={commentToEdit}
           resourceId={rowId}
           GetCommentList={GetCommentList}
         />
       )}
     </div>
   );
};

export default AddComment;