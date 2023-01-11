import React, {useEffect, useState} from 'react';
import {Button, Container, Paper} from '@material-ui/core';
import {useNavigate} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import Axios from "../../custom-axios/axios.js";
import { Link } from "react-router-dom";
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function AdministratorGetWarrantiesByOwner() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();


    const [warranties, setWarranties] = useState([]);
    const [owner, setOwner] = useState('');

    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            navigate('/login');
            window.location.reload();
        }

        fetchWarranties();
        // fetchWarrantiesByOwner();
    }, []);


    const fetchWarranties = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`administrator/warranties`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
            (response) => {
                setWarranties(response.data);
            }
        );
    };

    const setWarrantyId = (id) => {
        localStorage.setItem('warrantyId', id);
    };

    // ili da gi searcha od ovie warranties sto se' vekje vrateni

    const fetchWarrantiesByOwner = async (owner) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        await Axios.get(`administrator/warranties/${owner}`, 
        {headers: {"Authorization": `Bearer ${accessToken}`}})
        .then(
            (response) => {
                setWarranties(response.data);
            }
        );
    };

    return (

        <Container>
            <Container>
                <h1>Assign Warranty</h1>

                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="outlined-basic" label="Warranty Owner" variant="outlined" fullWidth
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                    />
                    <Button variant="contained" color="secondary" onClick={() => fetchWarrantiesByOwner(owner)}>
                        Submit
                    </Button>
                </form>
            </Container>

            <Paper elevation={3} style={paperStyle}>

                {warranties.map(warranty => (
                    <Container>
                        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={warranty.id}>
                            id: {warranty.id}<br />
                            Service: {warranty.warrantyService}<br />
                            Expiration Date: {warranty.warrantyExpirationDate}<br />
                            Issue Date: {warranty.warrantyIssueDate}<br />
                            Status: {warranty.warrantyStatus}<br />
                            owner: {warranty.owner}<br />
                            issuer: {warranty.issuer}
                        </Paper>
                        <Link
                            to={"/administrator-warranty-detail"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    View Details
                                </Button>
                        </Link>
                        <Link
                            to={"/administrator-warranty-history"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                Warranty History
                                </Button>
                        </Link>
                    </Container>
                ))}
            </Paper>
            <Link
                to={"/dashboard"}>
                <Button>
                    Back to dashboard
                </Button>
            </Link>
        </Container>
    );
}