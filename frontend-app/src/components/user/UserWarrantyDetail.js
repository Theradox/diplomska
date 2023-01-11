import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Axios from "../../custom-axios/axios.js";
import TextField from '@material-ui/core/TextField';
import { Container } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import {Button} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));
export default function UserWarrantyDetail() {
    const classes = useStyles();

    const [id, setId] = useState('');
    const [issuer, setIssuer] = useState('');
    const [owner, setOwner] = useState('');
    const [warrantyStatus, setWarrantyStatus] = useState('');
    const [warrantyService, setWarrantyService] = useState('');
    let [warrantyIssueDate, setWarrantyIssueDate] = useState('');
    let [warrantyExpirationDate, setWarrantyExpirationDate] = useState('');

    const navigate = useNavigate();


    useEffect( () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        if (!accessToken) {
            navigate('/login');
        }

        fetchWarranty();
        // localStorage.removeItem("warrantyId");

    }, []);

    const fetchWarranty = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
        const warrantyId = localStorage.getItem('warrantyId');

        await Axios.get(`user/warranty/${warrantyId}`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
            (response) => {
                console.log(JSON.stringify(response.data));
                setId(JSON.parse(JSON.stringify(response.data.id)));
                setIssuer(JSON.parse(JSON.stringify(response.data.issuer)));
                if (response.data.owner) {
                    setOwner(JSON.parse(JSON.stringify(response.data.owner)));
                }
                setWarrantyStatus(JSON.parse(JSON.stringify(response.data.warrantyStatus)));
                setWarrantyService(JSON.parse(JSON.stringify(response.data.warrantyService)));
                setWarrantyIssueDate(JSON.parse(JSON.stringify(response.data.warrantyIssueDate)));
                setWarrantyExpirationDate(JSON.parse(JSON.stringify(response.data.warrantyExpirationDate)));
            }
        );
    };


    return (
        // <TextField id="outlined-basic" label="Warranty Id" variant="outlined" fullWidth
        // value={id}/>   

        <Container>
            <form className={classes.root} noValidate autoComplete="off">
                  <TextField id="outlined-basic" label="Warranty Id" variant="outlined" fullWidth
                        value={id}
                />

                <TextField id="outlined-basic" label="Warranty Issuer" variant="outlined" fullWidth
                        value={issuer}
                />
                <TextField id="outlined-basic" label="Warranty Owner" variant="outlined" fullWidth
                        value={owner}
                />

                <TextField id="outlined-basic" label="Warranty Status" variant="outlined" fullWidth
                        value={warrantyStatus}
                />

                <TextField id="outlined-basic" label="Warranty Service" variant="outlined" fullWidth
                        value={warrantyService}
                />

                <TextField id="outlined-basic" label="Warranty Issue Date" variant="outlined" fullWidth
                        value={warrantyIssueDate}
                />

                <TextField id="outlined-basic" label="Warranty Expiration Date" variant="outlined" fullWidth
                        value={warrantyExpirationDate}
                />

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