import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function AdminRoute({children}) {
    const {userType} = useSelector((s)=>s.login);
    if(userType==="admin"){
        return children
    }
    else{
        return <Navigate to="/"/>

    }
}

export default AdminRoute
