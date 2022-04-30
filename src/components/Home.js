import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import {useSelector} from "react-redux";
import {selectHomePageArticles} from "../store/selectors";
import {collection, getDocs, query, where, limit} from "firebase/firestore";
import db from "../firebase-config";
import store from "../store/store";
import actions from "../store/actions";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {ErrorBoundary} from 'react-error-boundary'

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
        margin: theme.spacing(3)
    },
}));


const Home = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const homePageArticles = useSelector(selectHomePageArticles);

    const getHomePageArticles = async () => {
        const snapshots = [];
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where("markAsHome", "==", true) , limit(3));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            snapshots.push(doc.data());
        });

        // reset article data with reducer
        store.dispatch(actions['RESET_ARTICLE_DATA']({}));
        store.dispatch(actions['LOAD_HOMEPAGE_ARTICLES']({
            articles: snapshots,
        }));
    };

     const ErrorHandler = ({error}) => {
        return (
            <div role="alert">
                <p>An error occurred:</p>
                <pre>{error.message}</pre>
            </div>
        )
    }

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate('/')
        }

        if (!authToken) {
            navigate('/login')
        }
        getHomePageArticles();
    }, [])


    return (
        <>
            <ErrorBoundary FallbackComponent={ErrorHandler}>
                <div className={classes.articleWrapper}>
                    {homePageArticles && homePageArticles.map(article => (
                        <Card  className={classes.articleCard} key={article.id} sx={{ maxWidth: 345, marginBottom: '10px' }}>
                            <b>{article.date.seconds}</b>
                            <CardActionArea >
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
                        </Card>
                    ))}
                </div>
            </ErrorBoundary>
        </>
    );
}

export default Home;
