import React, {useEffect, useState} from 'react';
import RepositoriesApi from '../services/RepositoriesApi';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import {makeStyles} from "@material-ui/core/styles";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Search from "./Search";
import {useNavigate} from "react-router-dom";
import {useApplicationContext} from "../utils/Context";
import {DEFAULT_PER_PAGE, getQueryVariable} from "../utils/Common";
import Loader from "react-loader-spinner";

const Repositories = () => {
    const [repositories, setRepositories] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const {term} = useApplicationContext();
    const navigate = useNavigate();
    const useStyles = makeStyles((theme) => ({
        container: {
            display: 'flex',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            alignItems: 'stretch',
        },
        root: {
            margin: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            alignContent: 'flex-start'
        },
    }));
    const classes = useStyles();
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    useEffect(() => {
        if(getQueryVariable('q')) {
            getRepositories(term);
        }
    }, [page, term])

    const paginationChangedNext = () => {
        setLoading(true);
        let next = page + 1;
        setPage(next);
    }

    const getRepositories = async (term) => {
        if (term && term.length) {
            const repos = await RepositoriesApi.getRepositories(page, DEFAULT_PER_PAGE, term);
            setRepositories(repos.data.items);
            setLoading(false);
        }
    };

    const paginationChangedPrev = () => {
        setLoading(true);
        let prev = page - 1;
        setPage(prev);
    }

    const searchCallback = (term) => {
        if (term) {
            setLoading(true);
            getRepositories(term);
        }else {
            setRepositories(null);
        }
        navigate({
            pathname: `/repositories?q=${term}`
        });
    }
    return (
        <div>
           <>
               {!loading ? (
                   <>
                       <Box className={classes.root}>
                           { repositories && (<Stack direction="row" spacing={2}>
                               <Button onClick={paginationChangedPrev} size="small" variant="contained">Prev</Button>
                               <Button onClick={paginationChangedNext} size="small" variant="contained">Next</Button>
                           </Stack>)}
                           {<Search searchCallback={searchCallback} placeholder="Search Repository"/>}
                       </Box>
                       {repositories && repositories.map( (repository) => {
                           return (
                               <React.Fragment key={repository.node_id}>
                                   <Accordion
                                       expanded={expanded === repository.node_id}
                                       onChange={handleChange(repository.node_id)}
                                   >
                                       <AccordionSummary
                                           expandIcon={<ExpandMoreIcon />}
                                           aria-controls="panel1bh-content"
                                           id="panel1bh-header"
                                       >
                                           <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                               {repository.name}
                                           </Typography>
                                           <Typography sx={{ color: 'text.secondary' }}>{repository.full_name}</Typography>
                                       </AccordionSummary>
                                       <AccordionDetails>
                                           <Box className={classes.container}>
                                               <Card sx={{ maxWidth: 150, margin: 2.5 }}>
                                                   <CardActionArea href={repository.owner.html_url} target="_blank">
                                                       <CardMedia
                                                           component="img"
                                                           height="140"
                                                           image={repository.owner.avatar_url}
                                                           alt="green iguana"
                                                       />
                                                       <CardContent>
                                                           <Typography gutterBottom variant="h5" component="div">
                                                               {repository.owner.login}
                                                           </Typography>
                                                       </CardContent>
                                                   </CardActionArea>
                                               </Card>
                                               <Stack sx={{ width: '80%', margin: 2.2 }} spacing={1}>
                                                   <Alert severity="info">
                                                       <>
                                                           <AlertTitle >
                                                               Repo url: <a target="_blank" rel="noreferrer" href={repository.html_url}>Click it for go to Repo</a>
                                                           </AlertTitle>

                                                       </>
                                                   </Alert>
                                               </Stack>
                                           </Box>
                                       </AccordionDetails>
                                   </Accordion>
                               </React.Fragment>
                           )
                       })}
                   </> ): (<Loader
                       className="spinner"
                       type="ThreeDots"
                       color="black"
                       height={100}
                       width={100}
                       />)
                    }
           </>
        </div>
    );
}

export default Repositories;
