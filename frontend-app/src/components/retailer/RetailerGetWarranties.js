import React, {useEffect, useState} from 'react';
import {Button, Container, Paper} from '@material-ui/core';
import RetailerService from '../../services/retailer.service';
import {useNavigate} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import Axios from "../../custom-axios/axios.js";
import { Link } from "react-router-dom";
import retailerService from '../../services/retailer.service';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function RetailerGetWarranties() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();


    const [warranties, setWarranties] = useState([]);

    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) {
            navigate('/login');
            window.location.reload();
        }

        fetchWarranties();
    }, []);


    const fetchWarranties = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`retailer/warranties`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
            (response) => {
                setWarranties(response.data);
            }
        );
    };

    const setWarrantyId = (id) => {
        localStorage.setItem('warrantyId', id);
    };

    const terminateWarranty = async (id) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`retailer/terminate-ownership/${id}`,  {headers: {"Authorization": `Bearer ${accessToken}`}});
    };

    const renderWarranties = (warrantiesLength) => {
        if (warrantiesLength === 0) {
            return (
                <Container>
                    <Paper elevation={3} style={paperStyle}>
                        You have no assigned warranties
                        <Link
                            to={"/dashboard"}>
                            <Button>
                                Back to dashboard
                            </Button>
                        </Link>
                    </Paper>
                </Container>

            );
        } else {
            return (
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
                            to={"/retailer-warranty-detail"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    View Details
                                </Button>
                        </Link>
                        <Link
                            to={"/retailer-warranty-history"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                Warranty History
                                </Button>
                        </Link>
                        {warranty.warrantyStatus !== 'Assigned' && warranty.warrantyStatus !== 'Terminated' &&
                        <Link
                            to={"/retailer-warranty-assign"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    Assign Warranty
                                </Button>
                        </Link>
                        }
                        {warranty.warrantyStatus !== 'Terminated' &&
                        <Button onClick={() => terminateWarranty(warranty.id)}>
                            Terminate Warranty
                        </Button>
                        }
                        <Link
                            to={"/dashboard"}>
                            <Button>
                                Back to dashboard
                            </Button>
                        </Link>

                    </Container>
                ))}
            </Paper>
            );
        }
    }

    return (
        <Container>
            {renderWarranties(warranties.length)}
        </Container>
    );
}