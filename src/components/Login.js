import * as React from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom";
import {useEffect, useImperativeHandle} from "react";

const CustomInputField = React.forwardRef((props, inputRef) => {
    const newRef = React.useRef(null);
    useImperativeHandle(inputRef, () => ({
        focus: () => {
            newRef.current.focus();
            newRef.current.style.border = "solid red 1px";
            setTimeout(() => {
                newRef.current.style.border = "";
            }, 2500)
        },
    }))
    return (<input
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required={props.required}
        ref={newRef}
    />)
})

const Login = ({title, setEmail, setPassword, action, handleAction}) => {
    const inputRef = React.useRef();
    const navigate = useNavigate();
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
        inputRef.current.focus();
    }, [])

    return (
        <>
            <Box id="bg"></Box>
            <Box className="wrapper">
                <Box className="login-container">
                    <Box className="form-field">
                        <CustomInputField
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            ref={inputRef}
                        />
                    </Box>

                    <Box className="form-field">
                        <input
                               onChange={(e) => setPassword(e.target.value)}
                               type="password"
                               placeholder="Password"
                               required
                        />
                    </Box>

                    <Box className="form-field">
                        <button onClick={handleAction} className="btn">{title}</button>
                        {action===1 && (<button onClick={goRegistration} className="btn-reg">Register Now</button>)}
                        {action===2 && (<button onClick={goLogin} className="btn">Login Now</button>)}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Login;
