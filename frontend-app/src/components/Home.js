import React from 'react';
import {Button} from '@material-ui/core';
import {Link} from 'react-router-dom';
import '../css/bootstrap.min.css'


const Home = () => {


    return (
        // <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
        //     <Button variant="outlined"><Link to='/login'>Click here to login</Link></Button>
        //     <Button variant="contained"> <Link to='/register'>Click here to register</Link></Button>

    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
        <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
            <li class="nav-item" role="presentation">

                <Link to='/login'>
                    <a class="nav-link active" id="tab-login" data-mdb-toggle="pill" role="tab"
                    aria-controls="pills-login" aria-selected="true">
                        Login
                    </a>
                </Link>
            </li>
            <li class="nav-item" role="presentation">
                <Link to='/register'>
                    <a class="nav-link" id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
                    aria-controls="pills-register" aria-selected="false">
                        Register
                    </a>
                </Link>
            </li>
        </ul>
    </div>

        
    );
};

export default Home;
