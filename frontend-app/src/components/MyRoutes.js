import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import LoginUser from './LoginUser'
import RegisterUser from './RegisterUser';
import GetUsers from './GetUsers'
import Home from './Home';
import Appbar from './Appbar';
import TestAuthentication from './TestAuthentication';
import RetailerGetWarranties from './retailer/RetailerGetWarranties';
import RetailerWarrantyDetails from './retailer/RetailerWarrantyDetails';
import RetailerCreateWarranty from './retailer/RetailerCreateWarranty';
import RetailerWarrantyHistory from './retailer/RetailerWarrantyHistory';
import RetailerAssignWarrantyOwnership from './retailer/RetailerAssignWarrantyOwnership';
import UserWarrantyDetail from './user/UserWarrantyDetail';
import UserWarranties from './user/UserWarranties';
import UserGetWarranties from './user/UserGetWarranties';
import UserWarrantyHistory from './user/UserWarrantyHistory';
import UserTransferWarranty from './user/UserTransferWarranty';
import AdministratorGetWarrantyHistory from './administrator/AdministratorGetWarrantyHistory';
import AdministratorGetWarranty from './administrator/AdministratorGetWarranty';
import AdministratorGetWarranties from './administrator/AdministratorGetWarranties';
import AdministratorGetWarrantiesByOwner from './administrator/AdministratorGetWarranties';
import Login from './authentication/Login';
import Register from './authentication/Register';
import Dashboard from './Dashboard';
import { AppBar } from '@material-ui/core';

export default function MyRoutes() {

    const isLoggedIn = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
            <Router>
                <AppBar/>
                <Routes>
                    <Route exact path='/' element={<Home/>}/>
                    <Route exact path='/Home' element={<Home/>}/>
                    <Route path='/test-JWT' element={<TestAuthentication/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard/> : <Navigate to='/login'/>}/>

                    <Route path='/warranties' element={isLoggedIn ? <RetailerGetWarranties/> : <Navigate to='/login'/>}/>
                    <Route path='/create-warranty' element={isLoggedIn ? <RetailerCreateWarranty/> : <Navigate to='/login'/>}/>
                    <Route path='/retailer-warranty-detail' element={isLoggedIn ? <RetailerWarrantyDetails/> : <Navigate to='/login'/>}/>
                    <Route path='/retailer-warranty-history' element={isLoggedIn ? <RetailerWarrantyHistory/> : <Navigate to='/login'/>}/>
                    <Route path='/retailer-warranty-assign' element={isLoggedIn ? <RetailerAssignWarrantyOwnership/> : <Navigate to='/login'/>}/>

                    
                    <Route path='/all-warranties' element={isLoggedIn ? <UserGetWarranties/> : <Navigate to='/login'/>}/>
                    <Route path='/my-warranties' element={isLoggedIn ? <UserWarranties/> : <Navigate to='/login'/>}/>
                    <Route path='/user-warranty-detail' element={isLoggedIn ? <UserWarrantyDetail/> : <Navigate to='/login'/>}/>
                    <Route path='/user-warranty-history' element={isLoggedIn ? <UserWarrantyHistory/> : <Navigate to='/login'/>}/>
                    <Route path='/user-warranty-transfer' element={isLoggedIn ? <UserTransferWarranty/> : <Navigate to='/login'/>}/>

                    <Route path='/administrator-warranties' element={isLoggedIn ? <AdministratorGetWarranties/> : <Navigate to='/login'/>}/>
                    <Route path='/administrator-warranty-detail' element={isLoggedIn ? <AdministratorGetWarranty/> : <Navigate to='/login'/>}/>
                    <Route path='/administrator-warranty-history' element={isLoggedIn ? <AdministratorGetWarrantyHistory/> : <Navigate to='/login'/>}/>
                    <Route path='/administrator-warranty-owner' element={isLoggedIn ? <AdministratorGetWarrantiesByOwner/> : <Navigate to='/login'/>}/>

                </Routes>
            </Router>
        </div>
    );
}
