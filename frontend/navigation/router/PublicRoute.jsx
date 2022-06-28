import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
    const isAuth = window.walletConnection.isSignedIn()

    return isAuth ? <Navigate to={'/account'} /> : children
}

export default PublicRoute;