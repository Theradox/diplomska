import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AuthService from "../services/auth.service";
import {Button} from '@material-ui/core';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Appbar() {

    // todo: make useEffect() 

    const classes = useStyles();

    let isLoggedIn = AuthService.getCurrentUser();

    const renderAuthButton = () => {
        if (isLoggedIn) {
            return <Button variant="contained" color="secondary" onClick={AuthService.logout}>Logout</Button>
        } else {
            return <Button variant="contained" color="secondary" onClick={AuthService.login}>Login</Button>
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        NestJS React Full Stack Application
                    </Typography>
                    <Link to='/warranties'><Button>Warranties</Button></Link>
                    {renderAuthButton()}
                    <Link to='/login'><Button variant="contained">Login user</Button></Link>

                    <Link to='/register'><Button variant="contained">Register user</Button></Link>
                </Toolbar>

            </AppBar>
        </div>
    );
}
