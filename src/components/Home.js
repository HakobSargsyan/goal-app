import React, {useEffect} from 'react';
// import {makeStyles} from "@material-ui/core/styles";
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    // const useStyles = makeStyles((theme) => ({
    //     background:  {
    //         width: '100%'
    //     }
    // }));
    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate('/')
        }

        if (!authToken) {
            navigate('/login')
        }
    }, [])
    // const classes = useStyles();
    return (
        <div>
        </div>
    );
}

export default Home;
