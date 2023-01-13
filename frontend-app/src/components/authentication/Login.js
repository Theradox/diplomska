import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import AuthService from "../../services/auth.service";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const theme = createTheme();

export default function Login() {



  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationType, setOrganizationType] = useState('')

  const loginUser = async (e) => {
    e.preventDefault()
    await AuthService.login(username, email, organizationType, password)
        .then(
            () => {
                navigate('/dashboard');
                window.location.reload();
            },
            (error) => {
                console.log(error);
            }
        );
};

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            /> */}
            <TextField id="outlined-basic" label="User Username" variant="outlined" fullWidth
                        value={username}
                        name="username"
                        required
                        margin='normal'
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setUsername(e.target.value)}
            />
            <TextField id="outlined-basic" label="User Email" variant="outlined" fullWidth
                        value={email}
                        required
                        margin='normal'
                        onChange={(e) => setEmail(e.target.value)}
            />

            <TextField id="outlined-basic" label="User Organization" variant="outlined" fullWidth
                        value={organizationType}
                        required
                        margin='normal'
                        onChange={(e) => setOrganizationType(e.target.value)}
            />

            <TextField id="outlined-basic" label="User Password" variant="outlined" fullWidth
                        value={password}
                        required
                        margin='normal'
                        onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={"/"}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to={"/register"}>
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
