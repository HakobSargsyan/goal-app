import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useNavigate} from "react-router-dom";
const BasicCard = ({user}) => {
    const navigate = useNavigate();
    const {
        login,
        avatar_url,
    } = user;

    const clicked = () => {
        navigate({
            pathname: `/user/${login}`
        });
    }
    return (
        <Card sx={{ maxWidth: 345, marginBottom: 5 }}>
            <CardActionArea onClick={clicked}>
                <CardMedia
                    component="img"
                    height="140"
                    image={avatar_url}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {login}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default BasicCard;
