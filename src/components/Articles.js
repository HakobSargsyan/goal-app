import * as React from 'react';

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@mui/material/Typography';
import store from '../store/store';
import actions from '../store/actions';
import { useSelector } from 'react-redux';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Search from "./Search";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {collection, getDocs, doc, updateDoc} from "firebase/firestore";

import {
    articleCategories,
    sortByValues,
    TITLE,
    NEW_MODE,
    EDIT_MODE,
} from "../utils/Common";

import {selectConditonalArticles, selectAllArticles} from "../store/selectors";
import ArticleMakerModal from "./ArticleMakerModal";
import db from "../firebase-config";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import {useApplicationContext} from "../utils/Context";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '16px'
    },
    articleWrapper: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    articleCard: {
        marginLeft: theme.spacing(3)
    }
}));


const Articles = () => {
    const classes = useStyles();
    const conditionalArticles = useSelector(selectConditonalArticles);
    const allArticles = useSelector(selectAllArticles);
    const {open, setOpen} = useApplicationContext();
    const [sortBy, setSortBy] = React.useState("");
    const [categoryId, setCategoryId] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [mode, setMode] = React.useState(NEW_MODE);
    const [articleObject, setArticleObject] = React.useState({});
    window.store = store;


    const editArticle = (article) => {
        setMode(EDIT_MODE);
        setArticleObject(article);
        setOpen(true);
    }

    // passed to the search component
    const searchCallback = (term) => {
        store.dispatch(actions['SEARCH_ARTICLE']({
            filteredArticles: allArticles,
            term: term,
            sortByValue: sortBy,
            categoryId
        }));
    }

    /* Fetch article data on Init*/
    const loadFirebaseArticles = async () => {
        const snapshots = [];
        const querySnapshot = await getDocs(collection(db, "articles"));
        setLoading(false);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            data['id'] = doc.id;
            snapshots.push(data);
        });

        store.dispatch(actions['RESET_ARTICLE_DATA']({}));
        store.dispatch(actions['LOAD_ARTICLES']({
            articles: snapshots,
        }));
    }

    React.useEffect(() => {
        setLoading(true);
        loadFirebaseArticles();
    }, []);

    const sortByChange = (event) => {
        const sortByValue = sortByValues[event.target.value] ? sortByValues[event.target.value] : TITLE;
        setSortBy(event.target.value);
        store.dispatch(actions['SORT_ARTICLES']({
             articles: allArticles,
             sortByValue
        }));
    }

    const filterArticlesByCategory = (event) => {
        const categoryId = event.target.value;
        setCategoryId(categoryId);
        store.dispatch(actions['SEARCH_BY_CATEGORY']({
            filteredArticles: allArticles,
            categoryId
        }));
    }

    const markAsHome = async (article) => {
        const articlesRef = doc(db, "articles", article.id.toString());
        await updateDoc(articlesRef, {
            "markAsHome": true,
        });
        toast.success(`Article ${article.id} successfuly defined as a recent article` );
    }
    return (
       <>
           <Box className={classes.root}>
               <Stack direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={3} >
                   <Button onClick={() => {
                       setOpen(true);
                       setMode(NEW_MODE);
                   }} variant="contained">New Article</Button>
                   <Search placeholder="Search Your Article" searchCallback={searchCallback} />
                   <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                       <InputLabel id="demo-select-small">Sort</InputLabel>
                       <Select
                           labelId="demo-select-small"
                           id="demo-select-small"
                           value={sortBy}
                           label="Filter"
                           name='sortBy'
                           onChange={sortByChange}
                       >
                           <MenuItem value=" ">
                               <em>None</em>
                           </MenuItem>
                           { Object.keys(sortByValues).map((index) => (
                               <MenuItem key={index} value={index}>{
                                   sortByValues[index].charAt(0).toUpperCase() + sortByValues[index].slice(1)
                               }</MenuItem>
                            ))}
                       </Select>
                   </FormControl>
                   <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                       <InputLabel id="demo-select-small2">Category</InputLabel>
                       <Select
                           labelId="demo-select-small"
                           id="demo-select-small2"
                           value={categoryId}
                           label="Filter"
                           name="categoryId"
                           onChange={filterArticlesByCategory}
                       >
                           <MenuItem value=" ">
                               <em>None</em>
                           </MenuItem>
                           { Object.keys(articleCategories).map((index) => (
                               <MenuItem key={index} value={index}>{
                                   articleCategories[index]
                               }</MenuItem>
                           ))}
                       </Select>
                   </FormControl>
               </Stack>
           </Box>

           {loading ? (<Loader
               className="spinner"
               type="ThreeDots"
               color="black"
               height={100}
               width={100}
           />) :
               (
                    <>
                        <ToastContainer />
                        { !conditionalArticles && ( <h1>Your Articles</h1> ) }
                        <div className={classes.articleWrapper} >
                            {conditionalArticles && conditionalArticles.map(article => (
                                <Card className={classes.articleCard} key={article.id} sx={{ maxWidth: 345, marginBottom: '10px' }}>
                                    <b>{article.date.seconds}</b>
                                    <CardActionArea onClick={() => editArticle(article)}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image="https://cdn.motor1.com/images/mgl/m7oYq/s3/2021-mercedes-benz-s-class.jpg"
                                            alt="green iguana"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {article.title}
                                            </Typography>
                                            <div dangerouslySetInnerHTML={{ __html: article.description }} variant="body2" color="text.secondary">
                                            </div>
                                        </CardContent>

                                    </CardActionArea>
                                    <CardActions>
                                        <Button onClick={() => editArticle(article)} size="small" variant="contained" >Edit Article</Button>
                                        <Button color="error" onClick={() => markAsHome(article)} size="small" variant="contained" >Set to Home</Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>

                        <ArticleMakerModal articleObject={articleObject} open={open} setOpen={setOpen} mode={mode}/>
                    </>
               )}
       </>
    );
}

export default Articles;
