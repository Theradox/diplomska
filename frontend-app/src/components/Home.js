import React from 'react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import '../css/bootstrap.min.css'


const Home = () => {


    return (
        // <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <li class="nav-item" role="presentation">

                    {/* <Link to='/login'>
                    <a class="nav-link active" id="tab-login" data-mdb-toggle="pill" role="tab"
                    aria-controls="pills-login" aria-selected="true">
                        Login
                    </a>
                </Link> */}

                    <Button variant="contained" pole="user"><Link to='/login'>Click here to login to User Portal</Link></Button>
                </li>

                <li class="nav-item" role="presentation">
                    <Button variant="contained" pole="retailer"><Link to='/login'>Click here to login to Retailer Portal</Link></Button>
                </li>

                <li class="nav-item" role="presentation">
                    <Button variant="contained" pole="administrator"><Link to='/login'>Click here to login to Admin Portal</Link></Button>
                </li>


            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

            <li class="nav-item" role="presentation">
                    <Button variant="outlined"> <Link to='/register'>Click here to register</Link></Button>
                </li>
            </div>
        </div>
        


    );
};

export default Home;
