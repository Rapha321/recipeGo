import {useState, useEffect} from 'react'
import api from '../api'
import '../styles/Home.css'
import { Button, 
        Radio,
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
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants";
import LoginRegister from './LoginRegister.jsx'


const CreateRecipe = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState();
    const [showPublicOnly, setShowPublicOnly] = useState(false);
    const [formInputs, setFormInputs] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        image: "",
        prep_time: ""
    });

    useEffect(() => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      setIsLoggedIn(!!token); 
    }, []);

    const createRecipe = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formInputs) {
            formData.append(key, formInputs[key]);
        }
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        
        try {
            await api.post('/api/recipes/', formData); 
            showMessage("Recipe created successfully!");
            navigate('/my-recipes');

        } catch (error) {
            console.error("Error creating recipe:", error);
            showMessage("Error creating recipe");
        }
        setFormInputs({ title: "", description: "", ingredients: "", instructions: "", prep_time: "", image: "" });
        setSelectedFile(null);
    };

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormInputs(prevInputs => ({ ...prevInputs, [id]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (    
      <>
        {isLoggedIn ? (    
          <Paper elevation={4} sx={{ p: 4, my: 4, mx:2, borderRadius: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Create New Recipe
            </Typography>
            <Container component="form" onSubmit={createRecipe} sx={{ '& .MuiTextField-root': { mb: 2 }, width: "100%" }}>
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
                    label="Ingredients (comma separated)"
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
                    value={formInputs.prep_time}
                    onChange={handleInputChange}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Upload Image
                    </Typography>
                    <input
                        type="file"
                        accept="images/*"
                        onChange={handleFileChange}
                />
                </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Make this recipe public:
                </Typography>
                <Radio
                  checked={showPublicOnly}
                  id="public"
                  onClick={() => setShowPublicOnly(!showPublicOnly)}
                  name="show-public-radio"
                  value={formInputs.public}
                  inputProps={{ 'aria-label': 'Make recipe public' }}
                  onChange={handleInputChange}
                />
              </Box>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 2, borderRadius: 2 }}
                >
                    Add Recipe
                </Button>
            </Container>
          </Paper>) 
          : 
          (
            <LoginRegister msg={'Please login to create recipes.'}/>
          )}
      </>
    );
}

export default CreateRecipe;
