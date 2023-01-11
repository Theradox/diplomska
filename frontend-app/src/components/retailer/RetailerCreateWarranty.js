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



export default function RetailerCreateWarranty() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [issuer, setIssuer] = useState('');
    const [owner, setOwner] = useState('');
    const [warrantyStatus, setWarrantyStatus] = useState('');
    const [warrantyService, setWarrantyService] = useState('');
    let [warrantyIssueDate, setWarrantyIssueDate] = useState('');
    let [warrantyExpirationDate, setWarrantyExpirationDate] = useState('');


    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            navigate('/login');
            window.location.reload();
        }
    }, []);


    const createWarranty = async (e) => {
        e.preventDefault();
        warrantyIssueDate = new Date(warrantyIssueDate).toISOString();
        warrantyExpirationDate = new Date(warrantyIssueDate).toISOString();

        await RetailerService.createWarranty(id, issuer, owner, warrantyStatus, warrantyService, 
            warrantyIssueDate, warrantyExpirationDate)
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
        <h1>Create Warranty</h1>

            <form className={classes.root} noValidate autoComplete="off">


                <TextField id="outlined-basic" label="Warranty Id" variant="outlined" fullWidth
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                />

                <TextField id="outlined-basic" label="Warranty Issuer" variant="outlined" fullWidth
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                />
                <TextField id="outlined-basic" label="Warranty Owner" variant="outlined" fullWidth
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                />

                <TextField id="outlined-basic" label="Warranty Status" variant="outlined" fullWidth
                        value={warrantyStatus}
                        onChange={(e) => setWarrantyStatus(e.target.value)}
                />

                <TextField id="outlined-basic" label="Warranty Service" variant="outlined" fullWidth
                        value={warrantyService}
                        onChange={(e) => setWarrantyService(e.target.value)}
                />

                <TextField id="outlined-basic" label="Warranty Issue Date" variant="outlined" fullWidth
                        value={warrantyIssueDate}
                        onChange={(e) => setWarrantyIssueDate(e.target.value)}
                />

                <TextField id="outlined-basic" label="Warranty Expiration Date" variant="outlined" fullWidth
                        value={warrantyExpirationDate}
                        onChange={(e) => setWarrantyExpirationDate(e.target.value)}
                />

                <Button variant="contained" color="secondary" onClick={createWarranty}>
                    Submit
                </Button>
            </form>
            <Link
                to={"/dashboard"}>
                <Button>
                    Back to dashboard
                </Button>
            </Link>

        </Container>
    );
}
