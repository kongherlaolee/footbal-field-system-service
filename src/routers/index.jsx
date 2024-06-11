import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import BookingPage from "../pages/booking/BookingPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import TimePage from "../pages/time/TimePage";
import UserPage from "../pages/user/UserPage";
import FrontendHomePage from "../pages/frontend/FrontendHomePage";
import FrontendDetailStadium from "../pages/frontend/FrontendDetailStadium";
import FrontendHistory from "../pages/frontend/FrontendHistory";
import FrontendProfile from "../pages/frontend/FrontendProfile";
import { ACCESS_TOKEN, USER_DATA } from "../constants";
import PageNotFound from "../components/PageNotFound";
import Stadiums from "../pages/stadiums/Stadiums";
import DrinkPage from "../pages/drink/DrinkPage";
import FrontendAuth from "../pages/frontend/FrontendAuth";
import SalePage from "../pages/sale/SalePage";
import ReportSale from "../pages/report/sale/ReportSale";
import ReportBooking from "../pages/report/ReportBooking";
import ReportDrink from "../pages/report/drink/ReportDrink";
import ReportGoodDrink from "../pages/report/goodDrink/ReportGoodDrink";
import ContactUs from "../pages/frontend/ContactUs";
import ReserveYard from "../pages/frontend/ReserveYard";

const SwitchRoute = () => {
    const location = useLocation();
    const path = location.pathname;
    console.log(path);
    const hideSidebarRoutes = ["/login", '/', '/detail_stadium', '/contact', '/customer_history', '/reserve_yard', '/customer_profile', '/customer_auth', '/*'];
    return !hideSidebarRoutes.includes(path) && <Sidebar />
}

const MyRouter = () => {
    const routes = "/login"
    const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);
    const userData = JSON.parse(localStorage.getItem(USER_DATA))

    const publicRoutes = [
        { path: '/', element: <FrontendHomePage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/detail_stadium', element: <FrontendDetailStadium /> },
        { path: '/customer_history', element: <FrontendHistory /> },
        { path: '/reserve_yard', element: <ReserveYard /> },
        { path: '/customer_profile', element: <FrontendProfile /> },
        { path: '/customer_auth', element: <FrontendAuth /> },
        { path: '/contact', element: <ContactUs /> },
    ]

    const privateRoutes = [
        { path: '/home', element: <HomePage /> },
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/user', element: <UserPage /> },
        { path: '/time', element: <TimePage /> },
        { path: '/booking', element: <BookingPage /> },
        { path: '/stadium', element: <Stadiums /> },
        { path: '/drink', element: <DrinkPage /> },
        { path: '/sale', element: <SalePage /> },
        { path: '/report/booking', element: <ReportBooking /> },
        { path: '/report/sale', element: <ReportSale /> },
        { path: '/report/drink', element: <ReportDrink /> },
        { path: '/report/good-drink', element: <ReportGoodDrink /> }
    ]

    return (
        <Router>
            <div className="layout">
                <SwitchRoute />
                <Routes>
                    {/* private route */}
                    {
                        privateRoutes.map(({ path, element }) => {
                            if (isAuthenticated & userData?.role !== 'admin' & (path === "/home" || path === "/user")) return
                            return <Route path={path} element={isAuthenticated ? element : <Navigate to="/login" />} />
                        }
                        )
                    }

                    {/* public route */}
                    {
                        publicRoutes.map(({ path, element }) => {
                            return <Route path={path} element={element} />
                        })
                    }

                    <Route exact path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </Router>
    );
};

export default MyRouter