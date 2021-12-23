import * as React from 'react';
import Box from '@mui/material/Box';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Login = ({title, setEmail, setPassword, action, handleAction}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const goRegistration = () => {
        navigate('/register');
    }
    const goLogin = () => {
        navigate('/login');
    }
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate('/')
        }
    }, [])
    return (
        <>
            <Box id="bg"></Box>
            <Box className="wrapper">
                <Box className="login-container">
                    <Box className="form-field">
                        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required/>
                    </Box>

                    <Box className="form-field">
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
                               required/>
                    </Box>

                    <Box className="form-field">
                        <button onClick={handleAction} className="btn">{title}</button>
                        {action===1 && (<button onClick={goRegistration} className="btn">Registr Now</button>)}
                        {action===2 && (<button onClick={goLogin} className="btn">Login Now</button>)}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Login;
