import React, {useEffect, useState} from 'react';
import UserApi from '../services/UserApi';
import BasicCard from "./Card";
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import {makeStyles} from '@material-ui/core/styles';
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import {useApplicationContext} from '../utils/Context';
import Button from '@mui/material/Button';
import {DEFAULT_PER_PAGE, getQueryVariable} from "../utils/Common";
import Loader from "react-loader-spinner";

const Users = () => {
    const [users, setUsers] = useState(null);
    const {term} = useApplicationContext();
    const ref = React.createRef();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const useStyles = makeStyles((theme) => ({
        root: {
            margin: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            alignContent: 'flex-start'
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'space-around',
            justifyContent: 'space-evenly',
            marginTop: theme.spacing(3),
        },
    }));
    const classes = useStyles();

    useEffect(() => {
        if (getQueryVariable('q')) {
            getUsers(term);
        }
    },[page])

    const paginationChangedNext = () => {
        setLoading(true);
        let next = page + 1;
        setPage(next);
    }

    const paginationChangedPrev = () => {
        setLoading(true);
        let prev = page - 1;
        setPage(prev);
    }

    const getUsers = async (term) => {
        if (term && term.length) {
            const users = await UserApi.getUsersByTerm(term, page, DEFAULT_PER_PAGE);
            setUsers(users.data.items);
            if(!users.data.items.length){
                alert('Not found user');
            }
            setLoading(false);
        }
    }

    // passed to the search component
    const searchCallback = (term) => {
        if (term) {
            setLoading(true);
            getUsers(term);
        }else {
            setUsers(null);
        }
        navigate({
            pathname: `/users?q=${term}`
        });

    }

    return (
        <React.Fragment>
            {!loading ? (
                <>
                    <Box className={classes.root}>
                        { users && (<Stack direction="row" spacing={2}>
                            <Button onClick={paginationChangedPrev} size="small" variant="contained">Prev</Button>
                            <Button onClick={paginationChangedNext} size="small" variant="contained">Next</Button>
                        </Stack>)}
                        <Search placeholder="Search User" searchCallback={searchCallback} />
                    </Box>
                    <Box className={classes.container}>
                        { users && users.map(user => {
                            return (
                                <React.Fragment key={user.node_id}>
                                    <BasicCard user={user}/>
                                </React.Fragment>
                            )
                        })  }
                    </Box>
                    <Box className={classes.root}>
                        { users && (<Stack direction="row" spacing={2}>
                            <Button onClick={paginationChangedPrev} size="small" variant="contained">Prev</Button>
                            <Button onClick={paginationChangedNext} size="small" variant="contained">Next</Button>
                        </Stack>)}
                    </Box>
                </>
            )  : (<Loader
                className="spinner"
                type="ThreeDots"
                color="black"
                height={100}
                width={100}
            />)}

        </React.Fragment>
    );
}

export default Users;
