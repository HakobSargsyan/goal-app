import React, {useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@mui/material/Modal";
import {makeStyles} from "@material-ui/core/styles";
import ArticleMakerAddForm from "./ArticleMakerAddForm";

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

const ArticleMakerModal = ({open, setOpen}) => {
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
                        Write your Article
                    </Typography>
                    <IconButton onClick={handleModalState} >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <ArticleMakerAddForm
                    loading={loading}
                    setLoading={setLoading}
                    open={open}
                    setOpen={setOpen}
                />
            </Box>
        </Modal>
    );
}

export default ArticleMakerModal;
