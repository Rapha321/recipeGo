import {useState, useEffect} from 'react'
import { Button,
         Typography, 
         Container, 
         Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const LoginRegister = ({ msg }) => {

    const navigate = useNavigate();

    return (     
            <Container sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    {msg}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/login')}>
                    Login
                </Button>
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
            </Container>
    )
}


export default LoginRegister;