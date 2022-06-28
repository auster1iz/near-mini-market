import LoginPage from "../../../components/pages/LoginPage"
import MarketPlacePage from "../../../components/pages/MarketPlacePage"
import UserAccountPage from "../../../components/pages/UserAccountPage"

export const routes = {
    private: {
        account: '/account',
        market_place: '/market-place',
    },
    public: {
        login: '/',
    },
}

export const privateRoutes = [
    { path: routes.private.account, Element: UserAccountPage },
    { path: routes.private.market_place, Element: MarketPlacePage },
]

export const publicRoutes = [
    { path: routes.public.login, Element: LoginPage },
]