import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {makeStyles} from '@material-ui/core/styles'
import {ApplicationProvider} from '../utils/Context';
import LogoutIcon from '@mui/icons-material/Logout';

import {
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom";
import {useEffect} from "react";
import Loader from "react-loader-spinner";

const  Users = React.lazy(() => import('./Users'));
const  Articles = React.lazy(() => import('./Articles'));
const  Home = React.lazy(() => import('./Home'));
const  UserDetails = React.lazy(() => import('./UserDetails'));
const  Repositories = React.lazy(() => import('./Repositories'));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();
    return (
        <div
            className={classes.root}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'space-around',
        justifyContent: 'space-evenly',
        marginTop: theme.spacing(3),
    },
    tabs: {
        backgroundColor: '#eaebec'
    }
}));

const Navigation = ({path}) => {
    const [value, setValue] = React.useState(path);
    const classes = useStyles();
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem('Auth Token');
        navigate('/login')
    }
    return (
        <Box sx={{width: '100%' }}>
            <ApplicationProvider>
                    <Tabs variant="fullWidth"
                          className={classes.tabs}
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs example">
                        <Tab label="Home" value="/" component={Link} to='/' />
                        <Tab label="Users" value="/users" component={Link} to='/users' />
                        <Tab label="Repositories" value="/repositories" component={Link} to='/repositories' />
                        <Tab label="Articles" value="/articles" component={Link} to='/articles' />
                        <Tab icon={<LogoutIcon />} onClick={handleLogout} />
                    </Tabs>
                    <Suspense fallback={
                            <Loader
                                className="spinner"
                                type="ThreeDots"
                                color="black"
                                height={100}
                                width={100}
                            />
                        }>
                        <Routes>
                                <Route path='/users' element={<Users/>}  />
                                <Route path='/repositories' element={<Repositories />} />
                                <Route path='/followers' element={<Home />} />
                                <Route path='/articles' element={<Articles />} />
                                <Route path="/" element={<Home />} />
                                <Route path='/user/:username' element={<UserDetails />} />
                        </Routes>
                    </Suspense>
            </ApplicationProvider>
        </Box>
    );
}

export default Navigation;
