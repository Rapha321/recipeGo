import {useState, useEffect} from 'react'
import api from '../api'
import '../styles/Home.css'
import { Button, 
        Stack,
        TextField, 
        Dialog, 
        Snackbar, 
        DialogTitle, 
        DialogContent, 
        Typography, 
        DialogActions, 
        Box, 
        Paper, 
        Container, 
        List,
        Link, 
        ListItem, 
        IconButton,
        ListItemAvatar,
        Avatar,
        ListItemText } from '@mui/material';
import { Delete } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants";
import Chip from '@mui/material/Chip';
import Tag from './Tag.jsx';
import RecipeDialog from './RecipeDialog.jsx'
import LoginRegister from './LoginRegister.jsx'
import DeleteConfirmationDialog from './DeleteConfirmation.jsx'

const MyRecipes = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [message, setMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [myFavoriteRecipes, setMyFavoriteRecipes] = useState([]);
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);


    const getFavoriteRecipes = async () => {
        try {
            const res = await api.get("/api/favorites/");
            setMyFavoriteRecipes(res.data);
        } catch (err) {
            console.error("Error fetching favorites:", err);
        }
    };

    const getRecipes = async () => {
        try {
            const res = await api.get("/api/recipes/");
            setRecipes(res.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false); 
        }
    };

    // Fetch recipes on component mount
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) 
        {
            getRecipes();
            getFavoriteRecipes();
        }
        setIsLoggedIn(!!token); 
    }, []);

    const handleFavoriteClick = async (id) => {
        try {
            const isFavorite = myFavoriteRecipes.some(fav => fav.id === id);

            if (isFavorite) {
                // Send a DELETE request to remove the favorite
                await api.delete(`/api/favorites/delete/${id}/`);
                setMyFavoriteRecipes(prevFavs => prevFavs.filter(fav => fav.id !== id));
            } else {
                // Send a POST request to add the favorite
                const res = await api.post(`/api/favorites/add/`, { recipe_id: id });
                console.log("res:", res)
                // Add the new favorite to the state
                setMyFavoriteRecipes(prevFavs => [...prevFavs, res.data]);
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
        }
    };

    const handleTagClick = (recipeId) => {
        setOpenTagDialog(true);
        setSelectedRecipe(recipeId);
    };

    const handleCloseSnackbar = () => {
        setMessage(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setRecipeToDelete(null);
    };

    const handleDeleteClick = (id) => {
        setRecipeToDelete(id);
        setShowDeleteModal(true);
    };

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const confirmDelete = () => {
        api.delete(`/api/recipes/delete/${recipeToDelete}/`)
          .then((res) => {
            if (res.status === 204 || res.status === 200) {
              showMessage("Recipe deleted successfully!");
              setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeToDelete));
            } else {
              showMessage("Error deleting recipe");
            }
          })
          .catch((error) => {
            console.error("Error deleting recipe:", error);
            showMessage("Error deleting recipe");
          })
          .finally(() => {
            setShowDeleteModal(false);
            setRecipeToDelete(null);
        });
    };

    const handleRecipeClick = async (id) => {
        const res = await api.get(`/api/recipes/${id}/`);
        setSelectedRecipeDetails(res.data);
        setOpenRecipeDialog(true);
    };

    return (
        <>
            {/* Success/Error Message */}
            <Snackbar
                open={!!message}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog 
                open={showDeleteModal}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            {/* Display icons and logics */}
            { isLoggedIn ? (
                loading ? (
                    <Typography align="center" sx={{ mt: 4 }}>
                        Loading recipes...
                    </Typography>
                ) : 
                recipes.length > 0 ? (
                    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
                        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ my: 2 }}>
                            My Recipes
                        </Typography>

                        {recipes.map(recipe => (
                            <ListItem
                                key={recipe.id}
                                onClick={() => handleRecipeClick(recipe.id)}
                                secondaryAction = {
                                    <Stack direction="row" spacing={1}>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="heart" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteClick(recipe.id);
                                        }}
                                    >
                                        {
                                            myFavoriteRecipes.some(favorite => favorite.id === recipe.id) ? (
                                                <FavoriteIcon sx={{ color: 'red' }} />
                                            ) : (
                                                <FavoriteBorderIcon sx={{ color: 'red' }} />
                                        )}
                                    </IconButton>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="tag" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTagClick(recipe.id);
                                        }}
                                        sx={{ color: 'blue' }}
                                    >
                                        <LocalOfferIcon />
                                    </IconButton>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(recipe.id);
                                        }}
                                        sx={{ color: 'gray' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                    </Stack>
                                }
                                sx={{
                                        border: "1px solid #ccc",
                                        borderRadius: 2,
                                        mb: 2,
                                        alignItems: "flex-start", 
                                        p: 2,
                                        width: "94%",
                                        mx: "3%",
                                        transition: "border 0.2s ease-in-out",
                                                    "&:hover": {
                                                        border: "2px solid #1976d2",  
                                                    }
                                    }}
                            >
                            <Stack direction="row" spacing={2}>  
                                <ListItemAvatar>
                                    <Avatar 
                                        variant="rounded"
                                        src={
                                            recipe.image
                                                ? `${recipe.image}`
                                                : 'https://placehold.co/100x100'
                                        }
                                        alt={recipe.title}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="h6">{recipe.title}</Typography>}
                                    secondary={<Typography variant="body2" color="text.secondary">{recipe.description}</Typography>}
                                />
                            </Stack>

                        </ListItem>
                        ))}
                    </Paper>
                ) : (
                    <Typography variant="h5" component="p" align="center" color='text.secondary' sx={{ mt: 4 }}>
                        No recipes found. Please add some!
                    </Typography>
                )
            ) : 
            (
                <LoginRegister msg={'Please login to see your recipes.'} />
            )}

            <RecipeDialog
                open={openRecipeDialog}
                onClose={() => setOpenRecipeDialog(false)}
                recipeDetails={selectedRecipeDetails}
            />

            {/* Tag component */}
            <Tag
                open={openTagDialog}
                onClose={() => setOpenTagDialog(false)}
                recipeId={selectedRecipe}
            />
        </>
    )
}

export default MyRecipes;