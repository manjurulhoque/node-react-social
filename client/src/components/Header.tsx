import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Dropdown, Nav, Form, Card, Image, Button } from 'react-bootstrap';


import user1 from '../assets/images/user/1.jpg';


const Header: React.FC<any> = () => {

    const minisidebar = () => {
        document.body.classList.toggle('sidebar-main');
    }

    const signOut = (e: React.MouseEvent) => {
        e.preventDefault();
    }

    return (
        <>
            <div className="iq-top-navbar">
                <div className="iq-navbar-custom">
                    <Navbar expand="lg" variant="light" className="p-0">
                        <div className="iq-navbar-logo d-flex justify-content-between">
                            <Link to="/">
                                <span>SocialV</span>
                            </Link>
                            <div className="iq-menu-bt align-self-center">
                                <div className="wrapper-menu" onClick={minisidebar}>
                                    <div className="main-circle">
                                        <i className="ri-menu-line"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="iq-search-bar device-search">
                            <Form action="#" className="searchbox">
                                <Link className="search-link" to="#">
                                    <i className="ri-search-line"></i>
                                </Link>
                                <input type="text" className="text search-input" placeholder="Search here..." />
                            </Form>
                        </div>
                        <Navbar.Toggle as="button">
                            <i className="ri-menu-3-line"></i>
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav as="ul" className="ms-auto navbar-list">
                                <Dropdown as="li" className="nav-item">
                                    <Dropdown.Toggle href="#" bsPrefix="d-flex align-items-center search-toggle" >
                                        <Image src={user1} className="img-fluid rounded-circle me-3" alt="user" />
                                        <div className="caption">
                                            <h6 className="mb-0 line-height">email</h6>
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="sub-drop dropdown-menu caption-menu" aria-labelledby="drop-down-arrow">
                                        <Card className="shadow-none m-0">
                                            <Card.Header className="bg-primary">
                                                <div className="header-title">
                                                    <h5 className="mb-0 text-white">Hello Bni Cyst</h5>
                                                    <span className="text-white font-size-12">Available</span>
                                                </div>
                                            </Card.Header>
                                            <Card.Body className="p-0 ">
                                                <Link to="/dashboard/app/profile" className="iq-sub-card iq-bg-primary-hover d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded card-icon bg-soft-primary">
                                                            <i className="ri-file-user-line"></i>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 ">My Profile</h6>
                                                            <p className="mb-0 font-size-12">View personal profile details.</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to="/dashboard/app/user-profile-edit" className="iq-sub-card iq-bg-warning-hover d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded card-icon bg-soft-warning">
                                                            <i className="ri-profile-line"></i>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 ">Edit Profile</h6>
                                                            <p className="mb-0 font-size-12">Modify your personal details.</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to="/dashboard/app/user-account-setting" className="iq-sub-card iq-bg-info-hover d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded card-icon bg-soft-info">
                                                            <i className="ri-account-box-line"></i>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 ">Account settings</h6>
                                                            <p className="mb-0 font-size-12">Manage your account parameters.</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <Link to="/dashboard/app/user-privacy-setting" className="iq-sub-card iq-bg-danger-hover d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded card-icon bg-soft-danger">
                                                            <i className="ri-lock-line"></i>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 ">Privacy Settings</h6>
                                                            <p className="mb-0 font-size-12">Control your privacy parameters.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className="d-inline-block w-100 text-center p-3">
                                                    <button className="btn btn-primary iq-sign-btn" onClick={signOut}>Sign out
                                                        <i className="ri-login-box-line ms-2"></i>
                                                    </button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </>
    )
}

export default Header;