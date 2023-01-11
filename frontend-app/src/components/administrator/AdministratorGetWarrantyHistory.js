import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Axios from "../../custom-axios/axios.js";
import TextField from '@material-ui/core/TextField';
import {Button, Container, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { Link } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));
export default function AdministratorGetWarrantyHistory() {
     const classes = useStyles();   
     const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}



    const [warranties, setWarranties] = useState([]);


    const navigate = useNavigate();


    useEffect( () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            navigate('/login');
            window.location.reload();
        }

        fetchWarrantyHistory();
   

    }, []);

    const fetchWarrantyHistory = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
        const warrantyId = localStorage.getItem('warrantyId');

        await Axios.get(`administrator/warranties/${warrantyId}/history`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
            (response) => {
                console.log(JSON.stringify(response.data));
                setWarranties(response.data);
            }
        );
    };


  
    return (

        <Container>
            <h1>Warranty History</h1>
            <Paper elevation={3} style={paperStyle}>

                {warranties.map(warranty => (
                    <Container>
                        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={warranty.id}>
                            id: {warranty.id}<br />
                            Service: {warranty.warrantyService}<br />
                            Expiration Date: {warranty.warrantyExpirationDate}<br />
                            Issue Date: {warranty.warrantyIssueDate}<br />
                            Status: {warranty.warrantyStatus} <br />
                            owner: {warranty.owner}<br />
                            issuer: {warranty.issuer}
                        </Paper>

                    </Container>
                ))}
            </Paper>
            <Link
                to={"/administrator-warranties"}>
                <Button>
                    Back to dashboard
                </Button>
            </Link> 
        </Container>
    );


}