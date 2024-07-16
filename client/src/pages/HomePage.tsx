import React, { useEffect, useState } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Dropdown, OverlayTrigger, Tooltip, Modal, Card } from 'react-bootstrap';
import Layout from '../components/layouts/Layout';

import user1 from '../assets/images/user/1.jpg';

const HomePage: React.FC<any> = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate();
    const userLogin = useSelector((state: RootStateOrAny) => state.userLogin);
    const { loading, error, userInfo, isAuthenticated } = userLogin;

    const redirect: string = '/login';

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate(redirect);
    //     }
    // }, [isAuthenticated])

    return (
        <Layout>
            <Container>
                <Row>
                    <Col lg={12} className="row m-0 p-0">
                        <Col sm={12}>
                            <Card id="post-modal-data" className="card-block card-stretch card-height">
                                <div className="card-header d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Create Post</h4>
                                    </div>
                                </div>
                                <Card.Body >
                                    <div className="d-flex align-items-center">
                                        <div className="user-img">
                                            <img src={user1} alt="user1" className="avatar-60 rounded-circle" />
                                        </div>
                                        <form className="post-text ms-3 w-100 " onClick={handleShow}>
                                            <input type="text" className="form-control rounded" placeholder="Write something here..." style={{ border: "none" }} />
                                        </form>
                                    </div>
                                    <hr />
                                </Card.Body>
                                <Modal size="lg" className=" fade" id="post-modal" onHide={handleClose} show={show} >
                                    <Modal.Header className="d-flex justify-content-between">
                                        <Modal.Title id="post-modalLabel">Create Post</Modal.Title>
                                        <button type="button" className="btn btn-secondary" onClick={handleClose} ><i className="ri-close-fill"></i></button>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="d-flex align-items-center">
                                            <div className="user-img">
                                                <img src={user1} alt="user1" className="avatar-60 rounded-circle img-fluid" />
                                            </div>
                                            <form className="post-text ms-3 w-100 " data-bs-toggle="modal" data-bs-target="#post-modal">
                                                <input type="text" className="form-control rounded" placeholder="Write something here..." style={{ border: "none" }} />
                                            </form>
                                        </div>
                                        <hr />
                                        <button type="submit" className="btn btn-primary d-block w-100 mt-3">Post</button>
                                    </Modal.Body>
                                </Modal>
                            </Card>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
};

export default HomePage;