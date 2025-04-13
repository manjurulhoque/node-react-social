import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Row,
    Col,
    Container,
    Modal,
    Card,
    Form,
    Button,
} from "react-bootstrap";
import Layout from "../components/layouts/Layout";
import { useAuth, usePost } from "../context";
import Message from "../components/Message";
import PostList from "../components/PostList";

import user1 from "../assets/images/user/1.jpg";

const HomePage: React.FC<any> = () => {
    const { isAuthenticated, user } = useAuth();
    const { createPost, loading, error, clearError } = usePost();

    const [show, setShow] = useState(false);
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [postError, setPostError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShow(false);
        setDescription("");
        setImages([]);
        setPostError(null);
        clearError();
    };

    const handleShow = () => setShow(true);
    let navigate = useNavigate();

    const redirect: string = "/login";

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, navigate, redirect]);

    useEffect(() => {
        if (error) {
            setPostError(error);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim()) {
            setIsSubmitting(true);
            try {
                await createPost({ description, images });
                handleClose();
            } catch (err) {
                // Error is handled by the PostContext
                console.error("Error creating post:", err);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setPostError("Post description cannot be empty");
        }
    };

    return (
        <Layout>
            <Container>
                <Row>
                    <Col lg={12} className="row m-0 p-0">
                        <Col sm={12}>
                            <Card
                                id="post-modal-data"
                                className="card-block card-stretch card-height mb-4"
                            >
                                <div className="card-header d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">
                                            Create Post
                                        </h4>
                                    </div>
                                </div>
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className="user-img">
                                            <img
                                                src={
                                                    user?.profilePicture ||
                                                    user1
                                                }
                                                alt="user"
                                                className="avatar-60 rounded-circle"
                                            />
                                        </div>
                                        <div
                                            className="post-text ms-3 w-100"
                                            onClick={handleShow}
                                        >
                                            <input
                                                type="text"
                                                className="form-control rounded"
                                                placeholder="Write something here..."
                                                style={{ border: "none" }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                </Card.Body>
                                <Modal
                                    size="lg"
                                    className="fade"
                                    id="post-modal"
                                    onHide={handleClose}
                                    show={show}
                                >
                                    <Modal.Header className="d-flex justify-content-between">
                                        <Modal.Title id="post-modalLabel">
                                            Create Post
                                        </Modal.Title>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleClose}
                                        >
                                            <i className="ri-close-fill"></i>
                                        </button>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {postError && (
                                            <Message variant="danger">
                                                {postError}
                                            </Message>
                                        )}
                                        <Form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center">
                                                <div className="user-img">
                                                    <img
                                                        src={
                                                            user?.profilePicture ||
                                                            user1
                                                        }
                                                        alt="user"
                                                        className="avatar-60 rounded-circle img-fluid"
                                                    />
                                                </div>
                                                <Form.Group className="post-text ms-3 w-100">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Write something here..."
                                                        value={description}
                                                        onChange={(e) =>
                                                            setDescription(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </Form.Group>
                                            </div>
                                            <hr />
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="d-block w-100 mt-3"
                                                disabled={
                                                    isSubmitting || loading
                                                }
                                            >
                                                {isSubmitting || loading ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        Posting...
                                                    </>
                                                ) : (
                                                    "Post"
                                                )}
                                            </Button>
                                        </Form>
                                    </Modal.Body>
                                </Modal>
                            </Card>
                        </Col>
                    </Col>
                </Row>

                {/* Post List */}
                <Row>
                    <Col lg={12}>
                        <PostList />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default HomePage;
