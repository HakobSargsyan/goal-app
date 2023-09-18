import React from 'react';
import Loader from "react-loader-spinner";
import TextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    articleCategories, CATEGORY,
    DATE,
    KEY,
    MARKASHOME,
    SECONDS,
    ID,
    DESCRIPTION,
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
import {collection, addDoc, serverTimestamp, getDocs, onSnapshot} from "firebase/firestore";
import db from "../firebase-config";

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

const ArticleMakerAddForm = ({loading, setLoading, open, setOpen, loadFirebaseArticles}) => {
    const [fields, setFields] = React.useState({});
    const [markAsHome, setMarkAsHome] = React.useState(false);
    const [categoryField, setCategoryField] = React.useState('');
    const [fieldValidations, setFieldValidations] = React.useState({});
    const classes = useStyles();

    const onSave = (values) => {
        addDoc(collection(db, 'articles'), {
            ...values,
            date: serverTimestamp()
        }).then((ref) => {
            const dispatcher = {
                ...values,
                [DATE]: {
                    [SECONDS]: new Date().getTime()
                },
                [KEY]: (Math.random() + 1).toString(36).substring(7),
                [ID]: ref.id
            }

            // Dispatch the action for adding the article
            store.dispatch(actions['ADD_ARTICLE'](dispatcher));

            // After the ADD_ARTICLE action is dispatched, you can dispatch LOAD_ARTICLES
            // Here, you can fetch the latest data from Firestore to ensure you have the most up-to-date list
            // of articles before dispatching the LOAD_ARTICLES action
            getDocs(collection(db, "articles")).then((querySnapshot) => {
                const snapshots = [];
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    data['id'] = doc.id;
                    snapshots.push(data);
                });

                // Dispatch the LOAD_ARTICLES action with the updated list of articles
                store.dispatch(actions['LOAD_ARTICLES'](snapshots));
            });

        });
        handleModalState();
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
    const handleEditorChange = (value, editor, formik) => {
        setFields((prevState) => {
                return {
                    ...prevState,
                    [DESCRIPTION] : value
                }
            }
        );
        formik.setFieldValue('description', value);
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
                <Box >
                    <Formik
                        initialValues={{
                            title: '',
                            intro: '',
                            categoryId: '',
                            markAsHome: false,
                            description: ''
                        }}
                        validationSchema={Yup.object({
                            title: Yup.string()
                                .required('Title is Required'),
                            intro: Yup.string()
                                .required('Intro is Required'),
                            categoryId: Yup.string().required('Category is Required'),
                            description: Yup.string().required('Description is Required'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                onSave(values);
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {formik => ( <form onSubmit={formik.handleSubmit}>
                            <Box sx={{display: 'flex', gap: 1, flexDirection: 'column'}}>
                                <TextField
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    id="demo-helper-text-misaligned"
                                    label="Title of your article"
                                    name="title"
                                />
                                <TextField
                                    name="intro"
                                    value={formik.values.intro}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.intro && Boolean(formik.errors.intro)}
                                    helperText={formik.touched.intro && formik.errors.intro}
                                    id="demo-helper-text-misaligned-no-helper"
                                    label="Introtext of your article"
                                />
                                <TextField
                                    label="Category"
                                    select
                                    value={formik.values.categoryId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                                    helperText={formik.touched.categoryId && formik.errors.categoryId}
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
                                        <Checkbox
                                            checked={formik.values.markAsHome}
                                            onChange={formik.handleChange}
                                            name="markAsHome"
                                        />
                                    }
                                    label={label}
                                />
                                <FormControl error={Boolean(formik.errors.description)}>
                                    <Editor
                                        apiKey='puzg0ez1wyhidv96vluziw69j3k1ovz0wkev1qgz35g0k44w'
                                        textareaName='description'
                                        onEditorChange={(content, editor) => handleEditorChange(content, editor, formik)}
                                        value={formik.values.description}
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
                                    {formik.errors.description && (
                                        <FormHelperText>{formik.errors.description}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>
                            {!loading && (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    flexWrap: 'wrap',
                                    '& > :not(style)': { m: 1 },
                                }}>
                                    <Button type="submit" variant="contained" className={classes.modalButton}>
                                        Save
                                    </Button>
                                    <Button className={classes.modalButton} onClick={handleModalState} variant="contained">Close</Button>
                                </Box>
                            )}
                        </form>)}
                    </Formik>
                </Box>
            )}
        </Box>
    )
}

export default ArticleMakerAddForm;
