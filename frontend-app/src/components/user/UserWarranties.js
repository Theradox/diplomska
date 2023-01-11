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

export default function UserWarranties() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto", textAlign: 'center'}
    const classes = useStyles();

    const navigate = useNavigate();


    const [warranties, setWarranties] = useState([]);

    useEffect(() => {

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        if (!accessToken) {
            navigate('/login');
        }

        fetchWarranties();
    }, []);


    const fetchWarranties = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`user/my-warranties`, {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
            (response) => {
                let array = [];
                for (const x of response.data) {
                    array.push(x.Record);
                }
                setWarranties(array);
            }
        );
    };

    const setWarrantyId = (id) => {
        localStorage.setItem('warrantyId', id);
    };

    const acceptWarranty = async (id) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`user/my-warranties/accept-warranty/${id}`,  {headers: {"Authorization": `Bearer ${accessToken}`}});
        fetchWarranties();
    }

    const terminateWarranty = async (id) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;
    
        await Axios.get(`user/my-warranties/terminate-warranty/${id}`,  {headers: {"Authorization": `Bearer ${accessToken}`}});
        fetchWarranties();
    }

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
                warranties.map(warranty => (
                    <Container>
                        <Paper elevation={6} style={{ margin: "10px", padding: "15px", textAlign: "left" }} key={warranty.id}>
                            id: {warranty.id}<br />
                            Service: {warranty.warrantyService}<br />
                            Expiration Date: {warranty.warrantyExpirationDate}<br />
                            Issue Date: {warranty.warrantyExpirationDate}<br />
                            owner: {warranty.owner}<br />
                            issuer: {warranty.issuer}
                        </Paper>
                        <Link
                            to={"/user-warranty-detail"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    View Details
                                </Button>
                        </Link>
                        <Link
                            to={"/user-warranty-history"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    Warranty History
                                </Button>
                        </Link>
                        <Link
                            to={"/user-warranty-transfer"}>
                                <Button onClick={() => setWarrantyId(warranty.id)}>
                                    Transfer Warranty
                                </Button>
                        </Link>
                            {warranty.warrantyStatus !== 'Accepted' && 
                                <Button onClick={() => acceptWarranty(warranty.id)}>
                                    Accept Warranty
                                </Button>
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
                ))
            );
        }
    }

    return (

        <Container>
            {renderWarranties(warranties.length)}
        </Container>
    );
}