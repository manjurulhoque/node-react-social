import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router";
import { register } from '../actions/userActions';
import Loader from "../components/Loader";
import Message from "../components/Message";

const RegisterPage = () => {

    let navigate = useNavigate();
    let location = useLocation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo, isAuthenticated } = userLogin;

    const redirect = location.search ? location.search.split('=')[1] : '/login';

    useEffect(() => {
        navigate(redirect);
    }, [isAuthenticated, userInfo, redirect])

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(register(name, email, password));
    }

    return (
        <React.Fragment>
            <div className="main-wrap">
                <div className="nav-header bg-transparent shadow-none border-0">
                    <div className="nav-top w-100">
                        <a href="/">
                            <i className="feather-zap text-success display1-size me-2 ms-0"></i>
                            <span className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">
                                Sociala.{" "}
                            </span>{" "}
                        </a>
                        <button className="nav-menu me-0 ms-auto"></button>

                        <a
                            href="/login"
                            className="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"
                        >
                            Register
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div
                        className="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat"
                        style={{
                            backgroundImage: `url(assets/images/login-bg-2.jpg)`,
                        }}
                    ></div>
                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}
                    <div className="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
                        <div className="card shadow-none border-0 ms-auto me-auto login-card">
                            <div className="card-body rounded-0 text-left">
                                <h2 className="fw-700 display1-size display2-md-size mb-4">
                                    Create <br />
                                    your account
                                </h2>
                                <form onSubmit={onSubmit}>
                                    <div className="form-group icon-input mb-3">
                                        <i className="font-sm ti-user text-grey-500 pe-0"></i>
                                        <input
                                            type="text"
                                            required
                                            className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Enter Your Name"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group icon-input mb-3">
                                        <i className="font-sm ti-email text-grey-500 pe-0"></i>
                                        <input
                                            type="text"
                                            required
                                            className="style2-input ps-5 form-control text-grey-900 font-xsss fw-600"
                                            placeholder="Your Email Address Here"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group icon-input mb-3">
                                        <input
                                            type="Password"
                                            required
                                            className="style2-input ps-5 form-control text-grey-900 font-xss ls-3"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <i className="font-sm ti-lock text-grey-500 pe-0"></i>
                                    </div>

                                    <div className="col-sm-12 p-0 text-left">
                                        <div className="form-group mb-1">
                                            <button
                                                type="submit"
                                                className="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 "
                                            >
                                                Register
                                            </button>
                                        </div>
                                        <h6 className="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">
                                            Already have account{" "}
                                            <a href="/login" className="fw-700 ms-1">
                                                Login
                                            </a>
                                        </h6>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default RegisterPage;