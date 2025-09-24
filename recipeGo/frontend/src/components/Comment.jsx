import { useState, useEffect } from 'react';
import api from '../api';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../AuthContext';

const Comment = ({ recipeId }) => {
    const { isLoggedIn, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [profiles, setProfiles] = useState([]); 

    useEffect(() => {
        fetchData();
    }, [recipeId]);

    const fetchData = async () => {
        try {
            const commentsRes = await api.get(`/api/recipes/${recipeId}/comments/`);
            const profilesRes = await api.get('/api/profiles/');

            setComments(commentsRes.data);
            setProfiles(profilesRes.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/recipes/${recipeId}/comments/create/`, { content: newComment });
            setNewComment('');
            fetchData();
        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await api.delete(`/api/comments/delete/${commentId}/`);
            fetchData();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleCommentEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleUpdateSubmit = async () => {
        try {
            await api.patch(`/api/comments/update/${editingCommentId}/`, { content: editingContent });
            setEditingCommentId(null);
            setEditingContent('');
            fetchData();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, my: 4 }}>
            <Typography variant="h5" gutterBottom>Comments</Typography>
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Add a comment"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mb: 1 }}
                    disabled={!isLoggedIn}
                />
                <Button type="submit" variant="contained" color="primary" disabled={!newComment.trim()}>
                    Post Comment
                </Button>
            </Box>
            <List>
                {comments.map((comment) => {
                    const authorProfile = profiles.find(p => p.user === comment.created_by.id);
                    const profileImage = authorProfile ? authorProfile.image : null;
                    return (
                    <ListItem key={comment.id} alignItems="flex-start" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                        <ListItemAvatar>
                            <Avatar alt={comment.created_by.username} src={profileImage}>
                                {comment.created_by.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={comment.created_by.username}
                            secondary={
                                editingCommentId === comment.id ? (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            size="small"
                                            multiline
                                            rows={2}
                                        />
                                        <Button onClick={handleUpdateSubmit} 
                                                sx={{ mt: 1, mr: 1 }} 
                                                variant="contained" 
                                                size="small">Save
                                        </Button>
                                        <Button onClick={() => setEditingCommentId(null)} 
                                                sx={{ mt: 1 }} 
                                                size="small">Cancel
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            {comment.content}
                                        </Typography>
                                        <br />
                                        <Typography component="span" variant="caption" color="text.secondary">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </Typography>
                                    </>
                                )
                            }
                        />
                        {user && user.id === comment.created_by.id && (
                            <Box sx={{ display: 'flex' }}>
                                <IconButton onClick={() => handleCommentEdit(comment)} size="small" sx={{ mr: 1 }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleCommentDelete(comment.id)} size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </ListItem>
                )})}
            </List>
        </Paper>
    );
};

export default Comment;