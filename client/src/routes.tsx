import { BrowserRouter as Router, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

const BaseRouter = () => {
    return (
        <Router basename={"/"}>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/profile/:userId"
                        element={<UserProfilePage />}
                    />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
};

export default BaseRouter;
