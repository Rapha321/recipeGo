import { React, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";
import { 
        Box, 
        Paper, 
        TextField, 
        Button, 
        Link,
        Typography, 
        Stack } from "@mui/material";
import { useAuth } from "../AuthContext";


function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                login(res.data.access, res.data.refresh);
                navigate("/")
            } else {
                navigate("/profile")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", mt: '5%' }}>
            <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    {name}
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {loading && <LoadingIndicator />}

                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            disabled={loading}
                        >
                            {name}
                        </Button>
                    </Stack>
                </Box>

                {
                    method === 'login' ? (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            New here?{" "}
                            <Link 
                                onClick={() => navigate('/register')} 
                                style={{ 
                                        color: "#1976d2", 
                                        textDecoration: "none",
                                        cursor: 'pointer'
                                    }}
                                >
                                Create an account
                            </Link>
                        </Typography>
                    ) :
                    (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Already have an account?{" "}
                            <Link 
                                onClick={() => navigate('/login')} 
                                style={{ 
                                        color: "#1976d2", 
                                        textDecoration: "none",
                                        cursor: 'pointer'
                                    }}
                                >
                                Login
                            </Link>
                        </Typography>
                    )
                }


            </Paper>
        </Box>
    );
}

export default Form