import React from 'react'
import {  useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
  
  const {isAuth} = useSelector((store)=>store.login);
  console.log(isAuth);
  if(!isAuth){
    return <Navigate to="/login" />
  }
  return children;
}

export default PrivateRoute
