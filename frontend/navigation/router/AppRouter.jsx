import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import {privateRoutes, publicRoutes, routes} from "./constants/routes"
import PublicRoute from "./PublicRoute"
import PrivateRoute from "./PrivateRoute"
import MainLayout from "../../components/layouts/MainLayout";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map(({ path, Element }) => (
                    <Route key={path} path={path} element={
                            <PublicRoute>
                                <Element />
                            </PublicRoute>
                        }
                    />
                ))}
                {privateRoutes.map(({ path, Element }) => (
                    <Route key={path} path={path} element={
                            <PrivateRoute>
                                <MainLayout>
                                    <Element />
                                </MainLayout>
                            </PrivateRoute>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate to={routes.private.account} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter