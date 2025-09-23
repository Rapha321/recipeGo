import React, { useState } from 'react';
import {
    Stack,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../AuthContext.jsx';

const RecipeSecondaryAction = ({
    recipe,
    myFavoriteRecipes,
    handleFavoriteClick,
    handleTagClick,
    handleEditClick,
    handleDeleteClick
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const { isLoggedIn, user } = useAuth();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Shows on medium and up, hidden on small screens */}
            {!isSmallScreen ? (
                <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
                    <IconButton
                        aria-label="favorite"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteClick(recipe.id);
                        }}
                        disabled={recipe.created_by !== user?.user_id}
                    >
                        {myFavoriteRecipes.some(favorite => favorite.id === recipe.id) ? (
                            <FavoriteIcon sx={{ color: 'red' }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: 'red' }} />
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="tag"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(recipe.id);
                        }}
                        sx={{ color: 'blue' }}
                        disabled={recipe.created_by !== user?.user_id}
                    >
                        <LocalOfferIcon />
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(recipe.id);
                        }}
                        disabled={recipe.created_by !== user?.user_id}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(recipe.id);
                        }}
                        disabled={recipe.created_by !== user?.user_id}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ) : (
                <>
                    {/* Shows on small screens, hidden on medium and up */}
                    <IconButton
                        aria-label="more"
                        aria-controls={openMenu ? 'long-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleMenuClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleFavoriteClick(recipe.id); handleMenuClose(); }}>
                            <IconButton aria-label="favorite" sx={{ pr: 1 }} disabled={recipe.created_by !== user?.user_id}>
                                {myFavoriteRecipes.some(favorite => favorite.id === recipe.id) ? (
                                    <FavoriteIcon sx={{ color: 'red' }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ color: 'red' }} />
                                )}
                            </IconButton>
                            Favorite
                        </MenuItem>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleTagClick(recipe.id); handleMenuClose(); }}>
                            <IconButton aria-label="tag" sx={{ pr: 1 }} disabled={recipe.created_by !== user?.user_id}>
                                <LocalOfferIcon />
                            </IconButton>
                            Tag
                        </MenuItem>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(recipe.id); handleMenuClose(); }}>
                            <IconButton aria-label="edit" sx={{ pr: 1 }} disabled={recipe.created_by !== user?.user_id}>
                                <EditIcon />
                            </IconButton>
                            Edit
                        </MenuItem>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(recipe.id); handleMenuClose(); }}>
                            <IconButton aria-label="delete" sx={{ pr: 1 }} disabled={recipe.created_by !== user?.user_id}>
                                <DeleteIcon />
                            </IconButton>
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            )}
        </>
    );
};

export default RecipeSecondaryAction;