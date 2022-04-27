import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@mui/material/Modal";
import {makeStyles} from "@material-ui/core/styles";
import ArticleMakerAddForm from "./ArticleMakerAddForm";
import ArticleMakerEditForm from "./ArticleMakerEditForm";
import {NEW_MODE} from "../utils/Common";
const useStyles = makeStyles((theme) => ({
    closeButtonContainer : {
        justifyContent: 'space-between',
    },
    modalTitle: {
        margin: '5px',
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '80vh',
        background: 'white',
        boxShadow: 24,
        padding: theme.spacing(3),
        overflowY: 'auto',
    }
}));

const ArticleMakerModal = ({open, setOpen, mode, articleObject}) => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const handleClose = () => setOpen(false);
    const handleModalState = () => {
        setOpen(!open);
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalContainer}>
                <Box display="flex" className={classes.closeButtonContainer}>
                    <Typography gutterBottom variant="h5" component="span" className={classes.modalTitle}>
                        {mode === NEW_MODE ? "Write your Article" : "Edit your Article" }
                    </Typography>
                    <IconButton onClick={handleModalState} >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {mode === NEW_MODE ? (<ArticleMakerAddForm
                    loading={loading}
                    setLoading={setLoading}
                    open={open}
                    setOpen={setOpen}
                />) : (<ArticleMakerEditForm
                    loading={loading}
                    setLoading={setLoading}
                    open={open}
                    setOpen={setOpen}
                    articleObject={articleObject}
                />)}
            </Box>
        </Modal>
    );
}

export default ArticleMakerModal;
