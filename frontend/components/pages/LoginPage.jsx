import React from 'react';
import {login} from "../../utils/near/utils";
import {LOGIN, LOGIN_PAGE_TEXT_LOGIN, LOGIN_PAGE_TEXT_WELCOME, MINI_MARKET} from "../../constants";
import '../../styles/pages/login-page.css'

const LoginPage = () => {
    return (
        <div className="login flex items-center justify-center">
            <div className="login__container">
                <div className="login__container_text flex column items-center">
                    <p className="mt20">{LOGIN_PAGE_TEXT_WELCOME}
                        <span>{MINI_MARKET}</span>
                    </p>
                    <p className="mt20">{LOGIN_PAGE_TEXT_LOGIN}</p>
                </div>
                <div className="login__container_button flex justify-center">
                    <button className="button" onClick={login}>{LOGIN}</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;