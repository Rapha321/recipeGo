import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Stack,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Comment from './Comment.jsx';

const RecipeDialog = ({ open, onClose, recipeDetails }) => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const isOwner = isLoggedIn && recipeDetails?.created_by === user?.user_id && user?.user_id != null;

    const handleEditClick = () => {
        // Close the dialog before navigating
        onClose(); 
        navigate(`/recipes/update/${recipeDetails.id}`);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {recipeDetails && (
                <>
                    <DialogTitle>{recipeDetails.title}</DialogTitle>
                    <DialogContent dividers>
                        {/* ... (Existing content) ... */}
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <img
                                src={recipeDetails.image ? recipeDetails.image : "https://placehold.co/600x400"}
                                alt={recipeDetails.title}
                                style={{ maxWidth: "100%", borderRadius: "8px" }}
                            />
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {recipeDetails.description}
                        </Typography>
                        <Typography variant="subtitle1">Ingredients:</Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {recipeDetails.ingredients}
                        </Typography>
                        <Typography variant="subtitle1">Instructions:</Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {recipeDetails.instructions}
                        </Typography>
                        {isOwner && recipeDetails.tags && recipeDetails.tags.length > 0 && (
                            <>
                                <Typography variant="subtitle1">Tags:</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                                    {recipeDetails.tags.map((tag) => (
                                        <Chip key={tag.id} label={tag.name} color="primary" variant="outlined" />
                                    ))}
                                </Stack>
                            </>
                        )}
                        <Comment recipeId={recipeDetails.id} /> 
                    </DialogContent>
                    <DialogActions>
                        {isOwner && (
                            <Button
                                startIcon={<EditIcon />}
                                variant="contained"
                                color="primary"
                                onClick={handleEditClick}
                            >
                                Edit
                            </Button>
                        )}
                        <Button onClick={onClose} variant="contained" color="warning">Close</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default RecipeDialog;
