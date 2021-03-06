import React from 'react';
import Loader from "react-loader-spinner";
import TextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    articleCategories,
    CATEGORY,
    DATE,
    KEY,
    MARKASHOME,
    SECONDS,
    DESCRIPTION,
    TITLE,
    INTRO,
    ID,
    validateArticleMakerFieldsChange,
    validateArticleMakerFieldsSubmit
} from "../utils/Common";
import MenuItem from "@mui/material/MenuItem";
import {Editor} from "@tinymce/tinymce-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import store from "../store/store";
import actions from "../store/actions";
import {makeStyles} from "@material-ui/core/styles";
import {
    collection,
    query,
    where,
    getDocs,
    documentId,
    doc,
    updateDoc
} from "firebase/firestore";
import db from "../firebase-config";
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '16px'
    },
    tabs: {
        backgroundColor: '#eaebec'
    },
    modalButton: {
        width: '100%'
    },
    articleWrapper: {
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    closeButtonContainer : {
        justifyContent: 'space-between',
    },
    modalTitle: {
        margin: '5px',
    }
}));

const label = 'Show on Home Page';

const ArticleMakerEditForm = ({loading, setLoading, open, setOpen, articleObject}) => {
    const [markAsHome, setMarkAsHome] = React.useState(false);
    const [categoryField, setCategoryField] = React.useState('');
    const [fieldValidations, setFieldValidations] = React.useState({});
    const [fields, setFields] = React.useState({});
    const classes = useStyles();

    const fetchArticleObject = async () => {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, where(documentId(), "==", articleObject.id));
        const querySnapshot = await getDocs(q);
        // restore data from snapshot
        querySnapshot.forEach((doc) => {
            setFields((prevState) => {
                    return {
                        ...prevState,
                        [TITLE]: doc.data().title,
                        [ID]: doc.id,
                        [INTRO]: doc.data().intro,
                        [DESCRIPTION]: doc.data().description,
                        [MARKASHOME]: doc.data()?.markAsHome ? true : false,
                        [CATEGORY]: doc.data().categoryId,
                    }
                }
            );
            setCategoryField(doc.data().categoryId);
            setMarkAsHome(doc.data().markAsHome);
        });
    }
    React.useEffect(() => {
        fetchArticleObject()
    }, [])

    const onUpdate = async (article) => {
        let isValid = validateArticleMakerFieldsSubmit(fields, setFieldValidations);
        if (isValid) {
            // dispatch update article action
            const dispatcher = {
                ...fields,
                [DATE] : {
                    [SECONDS] : new Date().getTime()
                },
                [KEY]: (Math.random() + 1).toString(36).substring(7)
            }
            handleModalState();
            store.dispatch(actions['UPDATE_ARTICLE'](dispatcher));
            const articlesRef = doc(db, "articles", article.id);
            await updateDoc(articlesRef, fields);
            toast.success(`Article ${article.id} successfuly updated` );
        }
    }
    const handleModalState = () => {
        setFieldValidations({});
        setFields({});
        setOpen(!open);
    }
    const sortByChange = (event) => {
        const {name, value} = event.target;
        setCategoryField(value);
        setFields((prevState) => {
                return {
                    ...prevState,
                    [CATEGORY] : value
                }
            }
        );
        validateArticleMakerFieldsChange(setFieldValidations, name, value);
    }

    // store fields for tiny
    const handleEditorChange = (value, editor) => {
        setFields((prevState) => {
                return {
                    ...prevState,
                    [DESCRIPTION] : value
                }
            }
        );
    }

    // for custom inputs
    const inputChangeHandler = (event) => {
        const {name, value} = event.target;
        setFields((prevState) => {
                return {
                    ...prevState,
                    [name]: value
                }
            }
        );
        // validate fields
        validateArticleMakerFieldsChange(setFieldValidations, name, value);
    }

    const checkboxChangeHandler = (event) => {
        setMarkAsHome(event.target.checked);
        setFields((prevState) => {
                return {
                    ...prevState,
                    [MARKASHOME]: event.target.checked
                }
            }
        );
    };
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                '& > :not(style)': { m: 1 },
            }}
        >
            {loading ? (<Loader
                className="spinner"
                type="ThreeDots"
                color="black"
                height={100}
                width={100}
            />) : (
                <>
                    <TextField
                        error={Boolean(fieldValidations['title'])}
                        required
                        id="demo-helper-text-misaligned"
                        helperText={fieldValidations['title']}
                        onChange={inputChangeHandler}
                        onFocus={inputChangeHandler}
                        label="Title of your article"
                        name="title"
                        value={fields['title'] || ''}
                    />
                    <TextField
                        error={Boolean(fieldValidations['intro'])}
                        required
                        helperText={fieldValidations['intro']}
                        name="intro"
                        value={fields['intro'] || ''}
                        onChange={inputChangeHandler}
                        onFocus={inputChangeHandler}
                        id="demo-helper-text-misaligned-no-helper"
                        label="Introtext of your article"
                    />
                    <TextField
                        error={Boolean(fieldValidations['category'])}
                        helperText={fieldValidations['category']}
                        required
                        label="Category"
                        select
                        value={categoryField}
                        onChange={sortByChange}
                        name="categoryId"
                    >
                        { Object.keys(articleCategories).map(index => (
                            <MenuItem key={index} value={index}>
                                {articleCategories[index]}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={
                            <Checkbox checked={markAsHome}
                                      onChange={checkboxChangeHandler}
                            />
                        }
                        label = {label}
                    />
                </>
            )}
            <Editor
                apiKey='puzg0ez1wyhidv96vluziw69j3k1ovz0wkev1qgz35g0k44w'
                textareaName='description'
                onEditorChange={handleEditorChange}
                value={fields['description'] || ''}
                onInit={() => {
                    setLoading(false);
                }}
                init={{
                    height: 500,
                    menubar: false,
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            {!loading && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignContent: 'center',
                    flexWrap: 'wrap',
                    '& > :not(style)': { m: 1 },
                }}>
                    <Button className={classes.modalButton} onClick={() => onUpdate(articleObject)} variant="contained">Save</Button>
                    <Button className={classes.modalButton} onClick={handleModalState} variant="contained">Close</Button>
                </Box>
            )}
        </Box>
    )
}

export default ArticleMakerEditForm;
