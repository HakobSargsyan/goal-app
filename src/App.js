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
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const location = useLocation();
    const handleAction = (id) => {
            const authentication = getAuth();
            if (id === 2 && email && password ) {
                setLoading(true);
                createUserWithEmailAndPassword(authentication, email, password)
                    .then((response) => {
                        navigate('/')
                        sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
                        setLoading(false);
                    }).catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            toast.error('Email Already in Use');
                        }
                        setLoading(false);
                        toast.error(error.message);
                    })
            }

            if (id === 1 && email && password) {
                setLoading(true);
                signInWithEmailAndPassword(authentication, email, password)
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

            if (!email || !password) {
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
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    action={1}
                                    handleAction={() => handleAction(1)}
                                />}
                        />
                        <Route
                            path='/register'
                            element={
                                <Login
                                    title="Registration"
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    action={2}
                                    handleAction={() => handleAction(2)}
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
