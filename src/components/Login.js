import * as React from 'react';
import Box from '@mui/material/Box';
import {useNavigate} from "react-router-dom";
import {useEffect, useImperativeHandle} from "react";
import { useFormik } from 'formik';
import {validate} from "../utils/Formik/UserFormValidation";
import * as Yup from 'yup';

const CustomInputField = React.forwardRef((props, inputRef) => {
    const newRef = React.useRef(null);
    useImperativeHandle(inputRef, () => ({
        focus: () => {
            newRef.current.focus();
            newRef.current.style.border = "solid red 1px";
            setTimeout(() => {
                if (newRef.current) {
                        newRef.current.style.border = "";
                }
            }, 500)
        },
    }))
    return (<input
        type={props.type}
        placeholder={props.placeholder}
        {...props.formik.getFieldProps(props.name)}
        ref={newRef}
    />)
})

const Login = ({title, setEmail, setPassword, action, handleAction}) => {
    const baseValidationSchema = Yup.object({
        password: Yup.string()
            .min(6, 'Must be 6 characters or more')
            .required('Password is Required'),
        email: Yup.string().email('Invalid email address').required('Email is Required'),
    });

    const validationSchema = Yup.object().shape({
        ...baseValidationSchema.fields,

        // Conditionally include firstname and lastname based on the action
        ...(action === 1
            ? {}
            : {
                firstname: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Firstname is Required'),
                lastname: Yup.string()
                    .max(20, 'Must be 20 characters or less')
                    .required('Lastname is Required'),
            }),
    });
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstname: '',
            lastname: '',
        },
        // validate,
        validationSchema: validationSchema,
        onSubmit: values => {
            handleAction(action, values)
        },
    });
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
                    <form onSubmit={formik.handleSubmit} >
                        <Box className="form-field" sx={{flexWrap: 'wrap', gap: '8px', color: 'red'}}>
                            <CustomInputField
                                type="email"
                                name="email"
                                placeholder="Email"
                                formik={formik}
                                ref={inputRef}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <Box>{formik.errors.email}</Box>
                            ) : null}
                        </Box>
                        <Box className="form-field" sx={{flexWrap: 'wrap', gap: '8px', color: 'red'}}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <Box>{formik.errors.password}</Box>
                            ) : null}
                        </Box>
                        {action === 2 && (
                            <>
                                <Box className="form-field" sx={{flexWrap: 'wrap', gap: '8px', color: 'red'}}>
                                    <CustomInputField
                                        type="text"
                                        name="firstname"
                                        placeholder="Firstname"
                                        formik={formik}
                                    />
                                    {formik.touched.firstname && formik.errors.firstname ? (
                                        <Box>{formik.errors.firstname}</Box>
                                    ) : null}
                                </Box>
                                <Box className="form-field" sx={{flexWrap: 'wrap', gap: '8px', color: 'red'}}>
                                    <CustomInputField
                                        type="text"
                                        name="lastname"
                                        placeholder="Lastname"
                                        formik={formik}
                                    />
                                    {formik.touched.lastname && formik.errors.lastname ? (
                                        <Box>{formik.errors.lastname}</Box>
                                    ) : null}
                                </Box>
                            </>
                        )}
                        <Box className="form-field">
                            <button type="submit" className="btn">{title}</button>
                            {action===1 && (<button onClick={goRegistration} className="btn-reg">Register Now</button>)}
                            {action===2 && (<button onClick={goLogin} className="btn">Login Now</button>)}
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    );
}

export default Login;
