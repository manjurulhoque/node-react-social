import React, { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { login } from '../actions/userActions';
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, Container, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from '../assets/images/logo.png';


const LoginPage: React.FC<any> = () => {


    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state: RootStateOrAny) => state.userLogin);
    const { loading, error, userInfo, isAuthenticated } = userLogin;

    const redirect = '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, redirect])

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <>
            <section className="sign-in-page">
                <div id="container-inside">
                    <div id="circle-small"></div>
                    <div id="circle-medium"></div>
                    <div id="circle-large"></div>
                    <div id="circle-xlarge"></div>
                    <div id="circle-xxlarge"></div>
                </div>
                <Container className="p-0">
                    <Row className="no-gutters">
                        <Col md="6" className="text-center pt-5">
                            <div className="sign-in-detail text-white">
                                <Link className="sign-in-logo mb-5" to="#">
                                    <Image src={logo} className="img-fluid" alt="logo" />
                                </Link>
                                <div className="sign-slider overflow-hidden ">

                                </div>
                            </div>
                        </Col>
                        <Col md="6" className="bg-white pt-5 pt-5 pb-lg-0 pb-5">
                            <div className="sign-in-from">
                                <h1 className="mb-0">Sign in</h1>
                                <p>Enter your email address and password</p>
                                <Form className="mt-4" onSubmit={onSubmit}>
                                    <Form.Group className="form-group">
                                        <Form.Label htmlFor="exampleInputEmail1">Email address</Form.Label>
                                        <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} className="mb-0" id="exampleInputEmail1" placeholder="Enter email" />
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>Password</Form.Label>
                                        <Link to="#" className="float-end">Forgot password?</Link>
                                        <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} className="mb-0" id="exampleInputPassword1" placeholder="Password" />
                                    </Form.Group>
                                    <div className="d-inline-block w-100">
                                        <Form.Check className="d-inline-block mt-2 pt-1">
                                            <Form.Check.Input type="checkbox" className="me-2" id="customCheck11" />
                                            <Form.Check.Label>Remember Me</Form.Check.Label>{' '}
                                        </Form.Check>
                                        <Button variant="primary" type="submit" className="float-end">Sign in</Button>
                                    </div>
                                    <div className="sign-info">
                                        <span className="dark-color d-inline-block line-height-2">Don't have an account? <Link to="/register">Sign up</Link></span>
                                        <ul className="iq-social-media">
                                            <li><Link to="#"><i className="ri-facebook-box-line"></i></Link></li>
                                            <li><Link to="#"><i className="ri-twitter-line"></i></Link></li>
                                            <li><Link to="#"><i className="ri-instagram-line"></i></Link></li>
                                        </ul>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
};

export default LoginPage;