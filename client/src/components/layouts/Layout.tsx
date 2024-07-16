import React from 'react';
import Header from '../Header';
import Sidebar from '../partials/sidebar';

const Layout: React.FC<any> = ({ children }) => {
    return (
        <>
            <Sidebar />
            <Header />
            <div id="content-page" className="content-page">
                {children}
            </div>
        </>
    )
};

export default Layout;