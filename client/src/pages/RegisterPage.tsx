import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Row, Col, Container, Form, Button, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";

import logo from "../assets/images/logo.png";
import { useAuth } from "../context";

const RegisterPage: React.FC<any> = () => {
    const { register, error, loading, isAuthenticated } = useAuth();

    let navigate = useNavigate();
    let location = useLocation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const redirect = location.search ? location.search.split("=")[1] : "/login";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, navigate, redirect]);

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        register(name, email, password).then(() => {
            if (!error) {
                navigate(redirect);
            }
        });
    };

    return (
        <>
            <section className="sign-in-page">
                <div id="container-inside">
                    <div id="circle-small" />
                    <div id="circle-medium" />
                    <div id="circle-large" />
                    <div id="circle-xlarge" />
                    <div id="circle-xxlarge" />
                </div>
                <Container className="p-0">
                    <Row className="no-gutters">
                        <Col md="6" className="text-center pt-5">
                            <div className="sign-in-detail text-white">
                                <Link className="sign-in-logo mb-5" to="#">
                                    <Image
                                        src={logo}
                                        className="img-fluid"
                                        alt="logo"
                                    />
                                </Link>
                                <div className="sign-slider overflow-hidden"></div>
                            </div>
                        </Col>
                        <Col md="6" className="bg-white pt-5 pt-5 pb-lg-0 pb-5">
                            <div className="sign-in-from">
                                <h1 className="mb-0">Sign Up</h1>
                                <p>
                                    Enter your email address and password to
                                    access admin panel.
                                </p>
                                {error && (
                                    <Message variant="danger">{error}</Message>
                                )}
                                <Form className="mt-4" onSubmit={onSubmit}>
                                    <Form.Group className="form-group">
                                        <Form.Label>Your Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="mb-0"
                                            id="exampleInputEmail1"
                                            placeholder="Your Full Name"
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            required
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="mb-0"
                                            id="exampleInputEmail2"
                                            placeholder="Enter email"
                                        />
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="mb-0"
                                            id="exampleInputPassword1"
                                            placeholder="Password"
                                        />
                                    </Form.Group>
                                    <div className="d-inline-block w-100">
                                        <Form.Check className="d-inline-block mt-2 pt-1">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                id="customCheck1"
                                            />
                                            <Form.Check.Label>
                                                I accept{" "}
                                                <Link to="#">
                                                    Terms and Conditions
                                                </Link>
                                            </Form.Check.Label>
                                        </Form.Check>
                                        <Button
                                            type="submit"
                                            className="btn-primary float-end"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" />
                                                    Signing up...
                                                </>
                                            ) : (
                                                "Sign Up"
                                            )}
                                        </Button>
                                    </div>
                                    <div className="sign-info">
                                        <span className="dark-color d-inline-block line-height-2">
                                            Already have an account?{" "}
                                            <Link to="/login">Log In</Link>
                                        </span>
                                        <ul className="iq-social-media">
                                            <li>
                                                <Link to="#">
                                                    <i className="ri-facebook-box-line" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="#">
                                                    <i className="ri-twitter-line" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="#">
                                                    <i className="ri-instagram-line" />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default RegisterPage;
