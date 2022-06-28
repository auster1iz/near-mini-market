import React from 'react';
import AppRouter from "./navigation/router/AppRouter";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './styles/common-ui.css';
import './styles/common-spaces.css';
import './styles/global.css';
import './styles/flex.css';


const App = () => {
    return (
        <div>
            <AppRouter />
            <ToastContainer />
        </div>
    );
};

export default App;