import React, {useEffect, useState} from 'react';
import {Container, Paper} from '@material-ui/core';
import Axios from "../custom-axios/axios.js";
import AuthService from "../services/auth.service.js";
import {useNavigate} from "react-router-dom";

export default function GetUsers() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}

    const navigate = useNavigate();


    const [users, setUsers] = useState([]);

    useEffect(() => {

        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
            navigate('/login');
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        await Axios.get("/auth/users").then(
            (response) => {
                setUsers(response.data);
            },
            (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 403) {
                    AuthService.logout();
                    navigate("/LoginUser");
                    window.location.reload();
                }
            }
        );
    }


    return (

        <Container>
            <h1>Users</h1>

            <Paper elevation={3} style={paperStyle}>

                {users.map(user => (
                    <Paper elevation={6} style={{margin: "10px", padding: "15px", textAlign: "left"}} key={user.id}>
                        Id:{user.id}<br/>
                        Username:{user.username}<br/>
                        Email:{user.email}

                    </Paper>
                ))
                }
            </Paper>
        </Container>
    );
}