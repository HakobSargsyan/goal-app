import {useState} from 'react';
import './App.css';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Loader from "react-loader-spinner";
import {
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";
// eslint-disable-next-line
import { app } from './firebase-config';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const location = useLocation();
    const handleAction = (id, values) => {
        console.log(values, id);
        const authentication = getAuth();
            if (id === 2 && values.email && values.password ) {
                setLoading(true);
                createUserWithEmailAndPassword(authentication, values.email, values.password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        updateProfile(user, {
                            displayName: `${values.firstName} ${values.lastName}`,
                        })
                            .then(() => {
                                navigate('/');
                                sessionStorage.setItem('Auth Token', userCredential._tokenResponse.refreshToken);
                                setLoading(false);
                            })
                            .catch((error) => {
                                toast.error('Error updating user profile: ' + error.message);
                            });
                    })
                    .catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            navigate('/register');
                            toast.error('Email Already in Use');
                            setLoading(false);
                        } else {
                            toast.error(error.message);
                        }
                    });
            }

            if (id === 1 && values.email && values.password) {
                setLoading(true);
                signInWithEmailAndPassword(authentication, values.email, values.password)
                    .then((response) => {
                        navigate('/')
                        sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
                        setLoading(false);
                    }).catch((error) => {
                        if(error.code === 'auth/wrong-password'){
                            toast.error('Please check the Password');
                        }
                        if(error.code === 'auth/user-not-found'){
                            toast.error('Please check the Email');
                        }
                        setLoading(false);
                        toast.error(error.message);
                })
            }

            if (!values.email || !values.password) {
                toast.error('Please type your credentials');
            }

    }
    return (
        <div className="App">
                <ToastContainer />
                {loading && (<Loader
                        className="spinner"
                        type="ThreeDots"
                        color="black"
                        height={100}
                        width={100}
                    />)
                }
                {!loading && (
                    <Routes>
                        <Route
                            path='/login'
                            element={
                                <Login
                                    title="Login"
                                    action={1}
                                    handleAction={handleAction}
                                />}
                        />
                        <Route
                            path='/register'
                            element={
                                <Login
                                    title="Registration"
                                    action={2}
                                    handleAction={handleAction}
                                />}
                        />

                        <Route
                            path='/*'
                            element={
                                <Navigation path={location.pathname} />}
                        />
                    </Routes>
                    )
            }
        </div>
    );
}

export default App;
