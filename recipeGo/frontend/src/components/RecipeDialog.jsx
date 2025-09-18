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

const RecipeDialog = ({ open, onClose, recipeDetails }) => {
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
                        {recipeDetails.tags?.length > 0 && (
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