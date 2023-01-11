import React, {useEffect, useState} from 'react';
import {Button, Container, Paper} from '@material-ui/core';
import RetailerService from '../../services/retailer.service';
import {useNavigate} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import Axios from "../../custom-axios/axios.js";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));



export default function UserTransferWarranty() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();

    const [owner, setOwner] = useState('');


    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        if (!accessToken) {
            navigate('/login');
        }
    }, []);


    const transferWarranty = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem('warrantyId');

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        const warranty = {
            id,
            owner
        };

        return await Axios.put(`user/my-warranties/transfer-warranty`, warranty, {headers: {"Authorization": `Bearer ${accessToken}`}})
        .then(
            () => {
                navigate('/my-warranties');
                window.location.reload();
            },
            (error) => {
                console.log(error);
            }
        )
    };



    return (
        <Container>
        <h1>Transfer Warranty</h1>

            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Warranty Owner" variant="outlined" fullWidth
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                />
                <Button variant="contained" color="secondary" onClick={transferWarranty}>
                    Submit
                </Button>
            </form>
            <Link
                to={"/my-warranties"}>
                <Button>
                    Back to warranties
                </Button>
            </Link>
        </Container>
    );
}
