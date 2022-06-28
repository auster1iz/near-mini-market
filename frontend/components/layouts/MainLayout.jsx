import React from 'react';
import Navbar from "../common/Navbar";
import '../../styles/layouts/main-layout.css'

const MainLayout = ({children}) => {
    return (
        <div className="main-layout">
            <Navbar />
            <div className="main-layout__container">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;