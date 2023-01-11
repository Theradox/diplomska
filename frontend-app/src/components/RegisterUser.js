import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Paper} from '@material-ui/core';
import AuthService from "../services/auth.service";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

export default function RegisterUser() {
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"}
    const classes = useStyles();

    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [organizationType, setOrganizationType] = useState('')
    const [roles, setRoles] = useState('')


    const registerUser = async (e) => {
        e.preventDefault()
        await AuthService.register(username, email, organizationType, password, roles)
            .then(
                (response) => {
                    navigate("/Home");
                    window.location.reload();
                },
                (error) => {
                    console.log(error);
                }
            );
    }


    return (

        <Container>
            <Paper elevation={3} style={paperStyle}>
                <h1 style={{color: "blue"}}><u>Register User</u></h1>

                <form className={classes.root} noValidate autoComplete="off">

                    <TextField id="outlined-basic" label="User Username" variant="outlined" fullWidth
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField id="outlined-basic" label="User Email" variant="outlined" fullWidth
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField id="outlined-basic" label="User Organization" variant="outlined" fullWidth
                               value={organizationType}
                               onChange={(e) => setOrganizationType(e.target.value)}
                    />

                    <TextField id="outlined-basic" label="User Password" variant="outlined" fullWidth
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField id="outlined-basic" label="User Role" variant="outlined" fullWidth
                               value={roles}
                               onChange={(e) => setRoles(e.target.value)}
                    />

                    <Button variant="contained" color="secondary" onClick={registerUser}>
                        Submit
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}