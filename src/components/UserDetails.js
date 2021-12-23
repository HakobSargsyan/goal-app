import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import UserApi from "../services/UserApi";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import {makeStyles} from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const UserDetails = () => {
    const params = useParams();
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState(null);
    const useStyles = makeStyles((theme) => ({
        root: {
            margin: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
        },
        container: {
            margin: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignContent: 'flex-start',
        }
    }));
    const classes = useStyles();
    useEffect(() => {
       const getUser = async () => {
           const user = await UserApi.getUserByUsername(params.username);
           setUser(user.data);
           const repos = await UserApi.getUserRepos(user.data.repos_url, 1, 10);
           setRepos(repos.data)
       };
       getUser();
    }, [])

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <>
            { user && (
                <>
                    <Box className={classes.container}>
                        <Card sx={{ maxWidth: 345, margin: 2.5 }}>
                            <CardActionArea href={user.html_url} target="_blank">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={user.avatar_url}
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {user.login}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Followers: {user.followers}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Folowing: {user.following}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        <Stack sx={{ width: '80%', margin: 2.2 }} spacing={1}>
                            <Alert severity="info">
                                <>
                                    {user.bio && (<AlertTitle>{user.bio}</AlertTitle>)}
                                    {user.blog && ( <AlertTitle><a target="_blank" rel="noreferrer" href={user.blog}>Blog of {user.login} </a></AlertTitle>) }
                                    <AlertTitle>
                                        Email Address: {user.email}
                                    </AlertTitle>
                                    <AlertTitle>
                                        Company: {user.company}
                                    </AlertTitle>
                                    <AlertTitle >
                                        Creation Date: {user.created_at}
                                    </AlertTitle>
                                    <AlertTitle >
                                        Name: {user.name}
                                    </AlertTitle>
                                    <AlertTitle >
                                        Public Repos count: {user.public_repos}
                                    </AlertTitle>

                                </>
                            </Alert>
                        </Stack>
                    </Box>
                    <Typography gutterBottom variant="h5" component="div" sx={{ margin: 3}} >
                         Repositores List of {capitalize(user.login)}
                    </Typography>
                    <Box className={classes.root}>
                        {repos && repos.map((repo) => {
                                return (
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                        <ListItem sx={{ padding: 1.3, backgroundColor: 'rgb(229, 246, 253)' }} button target="_blank" component="a" href={repo.html_url}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ImageIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={repo.name} secondary="Jan 9, 2014" />
                                        </ListItem>
                                    </List>
                                )
                            })
                        }
                    </Box>
                </>
            ) }
        </>
    );
}

export default UserDetails;
