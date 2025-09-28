import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Home.css';
import {
    Button,
    Radio,
    Checkbox,
    TextField,
    Typography,
    Box,
    Paper,
    Container,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { ACCESS_TOKEN } from "../constants";
import LoginRegister from './LoginRegister.jsx';

const RecipeForm = () => { // Changed component name for clarity
    const navigate = useNavigate();
    const { id } = useParams(); // Get the recipe ID from the URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState();
    const [isPublic, setIsPublic] = useState(false); // Renamed for clarity
    const [formInputs, setFormInputs] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        prep_time: '',
    });

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        setIsLoggedIn(!!token);

        // If an ID exists, fetch recipe data
        if (id) {
            fetchRecipe(id);
        }
    }, [id]);

    const fetchRecipe = async (recipeId) => {
        try {
            const res = await api.get(`/api/recipes/${recipeId}/`);
            const recipeData = res.data;
            setFormInputs({
                title: recipeData.title,
                description: recipeData.description,
                ingredients: recipeData.ingredients,
                instructions: recipeData.instructions,
                prep_time: recipeData.prep_time,
            });
            setIsPublic(recipeData.public);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            // Handle not found case, e.g., navigate back
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formInputs) {
            formData.append(key, formInputs[key]);
        }
        formData.append('public', isPublic);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            if (id) {
                // Edit existing recipe
                await api.patch(`/api/recipes/update/${id}/`, formData);
                showMessage("Recipe updated successfully!");
            } else {
                // Create new recipe
                await api.post('/api/recipes/create/', formData);
                showMessage("Recipe created successfully!");
            }
            navigate('/my-recipes');
        } catch (error) {
            console.error("Error submitting recipe:", error);
            showMessage("Error submitting recipe");
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormInputs(prevInputs => ({ ...prevInputs, [id]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handlePublicChange = (e) => {
      setIsPublic(e.target.checked);
    };

    return (
        <>
            {isLoggedIn ? (
                <Paper elevation={4} sx={{ p: 4, my: 4, mx: 2, borderRadius: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom align="center">
                        {id ? "Edit Recipe" : "Create Recipe"}
                    </Typography>
                    <Container component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 }, width: "100%" }}>
                        <TextField
                            fullWidth
                            id="title"
                            label="Recipe Title"
                            variant="outlined"
                            value={formInputs.title}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            id="description"
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            value={formInputs.description}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            id="ingredients"
                            label="Ingredients"
                            variant="outlined"
                            multiline
                            rows={2}
                            value={formInputs.ingredients}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            id="instructions"
                            label="Instructions"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formInputs.instructions}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            id="prep_time"
                            label="Preparation Time"
                            variant="outlined"
                            type="text"
                            value={formInputs.prep_time || "HH:MM:SS"}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 1 }}
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Upload Image
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mr: 2 }}>
                                Make this recipe public:
                            </Typography>
                            <Checkbox
                                checked={isPublic}
                                id="public"
                                onClick={handlePublicChange}
                                name="is-public-checkbox"
                                value={isPublic}
                                slotProps={{ 'aria-label': 'Make recipe public' }}
                            />
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{ mt: 2, borderRadius: 2 }}
                        >
                            {id ? "Save Changes" : "Add Recipe"}
                        </Button>
                    </Container>
                </Paper>
            ) : (
                <LoginRegister msg={'Please login to create recipes.'} />
            )}
        </>
    );
};

export default RecipeForm;