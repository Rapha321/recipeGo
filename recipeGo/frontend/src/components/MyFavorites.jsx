import {useState, useEffect} from 'react'
import api from '../api'
import '../styles/Home.css'
import { Button, 
        Stack,
        Dialog, 
        Snackbar, 
        DialogTitle, 
        DialogContent, 
        Typography, 
        DialogActions, 
        Paper, 
        Box,
        Container, 
        ListItem, 
        IconButton,
        ListItemAvatar,
        Avatar,
        Link,
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
import { useAuth } from '../AuthContext.jsx';
import RecipeSecondaryActions from './RecipeSecondaryActions.jsx';


const MyFavorites = () => {

    const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const { isLoggedIn, user } = useAuth();


    const getFavoriteRecipes = async () => {
        try {
            const res = await api.get("/api/favorites/");
            setMyFavoriteRecipes(res.data);
        } catch (err) {
            console.error("Error fetching favorites:", err);
        } finally {
            setLoading(false);
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

    const handleEditClick = (recipeId) => {
        // Close the dialog before navigating
        setOpenRecipeDialog(false);
        navigate(`/recipes/update/${recipeId}`);
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

            {
                isLoggedIn ? 
                (
                    loading ? (
                        <Typography align="center" sx={{ mt: 4 }}>
                            Loading favorite recipes...
                        </Typography>
                    ) :
                    // is user is logged in and has recipes as favorite
                    myFavoriteRecipes.length > 0 ? 
                        (<Paper elevation={3} sx={{ p: 2, m: 2 }}>
                            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ my: 2 }}>
                                My Favorites
                            </Typography>

                            {myFavoriteRecipes.map(favRecipe => (
                                <ListItem
                                    key={favRecipe.id}
                                    onClick={() => handleRecipeClick(favRecipe.id)}
                                    secondaryAction={
                                        <RecipeSecondaryActions 
                                            recipe={favRecipe}
                                            myFavoriteRecipes={myFavoriteRecipes}
                                            handleFavoriteClick={() => handleFavoriteClick(favRecipe.id)}
                                            handleTagClick={() => handleTagClick(favRecipe.id)}
                                            handleEditClick={() => handleEditClick(favRecipe.id)}
                                            handleDeleteClick={() => handleDeleteClick(favRecipe.id)}
                                        />
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
                                                        "&:hover": { border: "2px solid #1976d2" }
                                        }}
                                >
                                    <Stack direction="row" spacing={2}>  
                                        <ListItemAvatar>
                                            <Avatar 
                                                variant="rounded"
                                                src={
                                                    favRecipe.image
                                                        ? `${favRecipe.image}`
                                                        : 'https://placehold.co/100x100'
                                                }
                                                alt={favRecipe.title}
                                                sx={{ width: 56, height: 56 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="h6">{favRecipe.title}</Typography>}
                                            secondary={<Typography variant="body2" color="text.secondary">{favRecipe.description}</Typography>}
                                        />
                                    </Stack>

                                </ListItem>
                            ))}
                        </Paper>
                    ) : 
                    (
                        // if user is logged in but has no recipes as favorite
                        <Container sx={{ my: 4, textAlign: 'center' }}>
                            <Typography variant="h5" color="text.secondary">
                                You have no favorite. Please add some!
                            </Typography>
                        </Container>
                    )
                ) :
                (
                    // if user is not logged in
                    <LoginRegister msg={'Please login to see your favorite recipes.'}/>
                )
            }

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

export default MyFavorites;