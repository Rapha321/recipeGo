import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Home.css';
import {
    Button,
    Paper,
    Container,
    Typography,
    Box,
    TextField,
    Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants";
import { useAuth } from '../AuthContext.jsx';


const ProfileSetup = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // You don't need 'user' here, as you're fetching the full profile
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        image_url: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            fetchUserProfile();
        } else {
            navigate('/profile');
        }
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const res = await api.get('/api/profile/');
            const data = res.data;

            setProfileData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                bio: data.bio || '',
                image_url: data.image || ''
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleFileChange = (e) => {
        setProfileData(prevData => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Use bracket notation to nest data
        formData.append('first_name', profileData.first_name);
        formData.append('last_name', profileData.last_name);
        
        // The rest of the profile data
        formData.append('bio', profileData.bio);
        if (profileData.image) {
            formData.append('image', profileData.image);
        }
        
        try {
            await api.patch('/api/profile/update/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage("Profile updated successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile.");
        }
    };

    return (
        <>
            {isLoggedIn ? (
                <Container component="main" maxWidth="sm">
                    <Paper elevation={4} sx={{ p: 4, my: 4, borderRadius: 3 }}>
                        <Typography variant="h4" component="h2" gutterBottom align="center">
                            Profile
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                            <TextField
                                fullWidth
                                id="first_name"
                                label="First Name"
                                variant="outlined"
                                value={profileData.first_name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                variant="outlined"
                                value={profileData.last_name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                fullWidth
                                id="bio"
                                label="Bio"
                                variant="outlined"
                                multiline
                                rows={3}
                                value={profileData.bio}
                                onChange={handleInputChange}
                            />
                            <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {profileData.image_url && (
                                    <Avatar src={profileData.image_url} sx={{ width: 56, height: 56 }} />
                                )}
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Profile Picture
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Box>
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, borderRadius: 2 }}
                            >
                                Save Profile
                            </Button>
                        </Box>
                        {message && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {message}
                            </Typography>
                        )}
                    </Paper>
                </Container>
            ) : (
                <Container sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                        Please log in to set up your profile.
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </Container>
            )}
        </>
    );
};

export default ProfileSetup;