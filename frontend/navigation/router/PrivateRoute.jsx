import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const isAuth = window.walletConnection.isSignedIn()

    return isAuth ? children : <Navigate to={'/'} />
}

export default PrivateRoute;