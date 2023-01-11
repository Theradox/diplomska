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



export default function RetailerAssignWarrantyOwnership() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [owner, setOwner] = useState('');


    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            navigate('/login');
            window.location.reload();
        }
    }, []);


    const assignWarranty = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem('warrantyId');

        await RetailerService.assignWarranty(id, owner)
        .then(
            () => {
                navigate('/warranties');
                window.location.reload();
            },
            (error) => {
                console.log(error);
            }
        );
    };



    return (
        <Container>
        <h1>Assign Warranty</h1>

            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Warranty Owner" variant="outlined" fullWidth
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                />
                <Button variant="contained" color="secondary" onClick={assignWarranty}>
                    Submit
                </Button>
            </form>
            <Link
                to={"/warranties"}>
                <Button>
                    Back to warranties
                </Button>
            </Link>
        </Container>
    );
}
