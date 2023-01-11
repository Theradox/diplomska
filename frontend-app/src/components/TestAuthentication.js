import React, {useEffect, useState} from 'react';
import {Container, Paper} from '@material-ui/core';
import Axios from "../custom-axios/axios.js";
import AuthService from "../services/auth.service.js";
import {useNavigate} from "react-router-dom";

export default function TestAuthentication() {

    const navigate = useNavigate();

        useEffect(() => {
            const access_token = localStorage.getItem('access_token');

            if (!access_token) {
                navigate('/login');
            }

            validateUser();
    }, []);

    const validateUser = async () => {
        await AuthService.testAuthentication();
    }




    return (

        <Container>
            <h1>Hello Logged in and authenticated User</h1>
        </Container>
    );
}