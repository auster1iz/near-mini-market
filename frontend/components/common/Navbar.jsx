import React from 'react';
import '../../styles/components/navbar.css';
import {useLocation, useNavigate} from "react-router-dom";
import {routes} from "../../navigation/router/constants/routes";
import {logout} from "../../utils/near/utils";
import {LOGOUT, MARKET_PLACE, MY_ACCOUNT, MINI_MARKET} from "../../constants";

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const navigateToMarketPlace = () => {
        navigate(routes.private.market_place)
    }
    const navigateToAccount = () => {
        navigate(routes.private.account)
    }

    const navButtonONClick = location.pathname === routes.private.account ? navigateToMarketPlace : navigateToAccount;
    const navButtonText = location.pathname === routes.private.account ? MARKET_PLACE : MY_ACCOUNT;

    const username = window.walletConnection._authData.accountId

    return (
        <div className="navbar flex items-center justify-between">
            <div className="navbar__logo">{MINI_MARKET}</div>
            <div className="navbar__items flex items-center">
                <div className="navbar__items_nav-button">
                    <button className="button" onClick={navButtonONClick}>
                        {navButtonText}
                    </button>
                </div>
                <button className="button" onClick={logout}>
                    {LOGOUT}
                </button>
                <div className="navbar__items-username">{ username }</div>
            </div>
        </div>
    );
};

export default Navbar;