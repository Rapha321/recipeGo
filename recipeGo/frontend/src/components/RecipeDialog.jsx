import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Stack
} from '@mui/material';
import { useAuth } from '../AuthContext.jsx';

const RecipeDialog = ({ open, onClose, recipeDetails }) => {

    const { isLoggedIn, user } = useAuth();
    const isOwner = isLoggedIn && recipeDetails?.created_by === user?.user_id && user?.user_id != null; 

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {recipeDetails && (
                <>
                    <DialogTitle>{recipeDetails.title}</DialogTitle>
                    <DialogContent dividers>
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
                        {isOwner && (
                            <>
                                <Typography variant="subtitle1">Tags:</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                                    {recipeDetails.tags.map((tag) => (
                                        <Chip key={tag.id} label={tag.name} color="primary" variant="outlined" />
                                    ))}
                                </Stack>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default RecipeDialog;