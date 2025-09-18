import * as React from 'react';
import {useState, useEffect} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import api from '../api'
import { Button, 
        Stack,
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
        ListItem, 
        IconButton,
        ListItemAvatar,
        Avatar,
        ListItemText } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';

const allTags = ["Dessert", "Vegan", "Quick", "Healthy", "Gluten-Free"];

const Tag = ({ open, onClose, recipeId }) => {
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [tags, setTags] = useState([]);       // all user tags
    const [newTag, setNewTag] = useState("");   // input for new tag
    const [selectedRecipe, setSelectedRecipe] = useState(null); // which recipe we're tagging
    const [recipeTags, setRecipeTags] = useState([]); // only tags for this recipe

    React.useEffect(() => {
        if (open) {
            fetchTags();
            fetchRecipeTags();
        }
    }, [open]);

    const handleTagClick = (recipeId) => {
        setSelectedRecipe(recipeId);
        setOpenTagDialog(true);
        fetchTags();  
    };

    const fetchTags = async () => {
        try {
            const res = await api.get("/api/tags/");
            setTags(res.data);
        } catch (err) {
            console.error("Error fetching tags:", err);
        }
    };

    const fetchRecipeTags = async () => {
        const res = await api.get(`/api/recipes/${recipeId}/`);
        setRecipeTags(res.data.tags || []);
    };


    const handleAddTag = async (name) => {
        // Check if tag already exists
        let tag = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());

        if (!tag) {
        // Create new tag
        const res = await api.post("/api/tags/", { name });
        tag = res.data;
        setTags((prev) => [...prev, tag]);
        }

        // Attach tag to this recipe
        await api.post(`/api/recipes/${recipeId}/attach_tag/`, { tag_id: tag.id });
        setRecipeTags((prev) => [...prev, tag]);
    };

    return (
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>Manage Tags</DialogTitle>
                <DialogContent dividers>
                    {/* Autocomplete input for existing or new tags */}
                    <Autocomplete
                        options={tags.map((tag) => tag.name)}
                        freeSolo
                        onChange={(e, value) => {
                            if (value) handleAddTag(value);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select or create a tag" />
                        )}
                    />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Tags for this recipe:
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                        {recipeTags.length > 0 ? (
                            recipeTags.map((tag) => (
                            <Chip
                                key={tag.id}
                                label={tag.name}
                                icon={<LocalOfferIcon />}
                                onDelete={async () => {
                                    await api.post(`/api/recipes/${recipeId}/detach_tag/`, { tag_id: tag.id });
                                    setRecipeTags((prev) => prev.filter((t) => t.id !== tag.id));
                                }}
                            />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No tags yet for this recipe.
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
    );
}

export default Tag;