import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Accordion } from 'react-bootstrap'
// import Scrollbar from 'smooth-scrollbar'

// function CustomToggle({ children, eventKey, onClick }) {

//     const { activeEventKey } = useContext(AccordionContext);

//     const decoratedOnClick = useAccordionButton(eventKey, (active) => onClick({ state: !active, eventKey: eventKey }));

//     const isCurrentEventKey = activeEventKey === eventKey;

//     return (
//         <Link to="#" aria-expanded={isCurrentEventKey ? 'true' : 'false'} className="nav-link" role="button" onClick={(e) => {
//             decoratedOnClick(isCurrentEventKey)
//         }}>
//             {children}
//         </Link>
//     );
// }
const Sidebar: React.FC<any> = () => {

    useEffect(() => {
        // Scrollbar.init(document.querySelector('#sidebar-scrollbar'));
    })
    const [activeMenu, setActiveMenu] = useState(false)
    let location = useLocation();

    return (
        <>
            <div className="iq-sidebar">
                <div id="sidebar-scrollbar">
                    <nav className="iq-sidebar-menu">
                        <Accordion as="ul" id="iq-sidebar-toggle" className="iq-menu">
                            <li className={`${location.pathname === '/' ? 'active' : ''} `}>
                                <Link to="/" ><i className="las la-newspaper"></i><span>Newsfeed</span></Link>
                            </li>
                            <li className={`${location.pathname === '/dashboard/app/profile' ? 'active' : ''}`}>
                                <Link to="/dashboard/app/profile" ><i className="las la-user"></i><span>Profile</span></Link>
                            </li>
                            <li className={`${location.pathname === '/dashboards/app/friend-list' ? 'active' : ''}`}>
                                <Link to="/dashboards/app/friend-list" ><i className="las la-user-friends"></i><span>Friend List</span></Link>
                            </li>
                            <li className={`${location.pathname === '/dashboard/app/friend-profile' ? 'active' : ''}`}>
                                <Link to="/dashboard/app/friend-profile" ><i className="las la-user-friends"></i><span>Friend Profile</span></Link>
                            </li>
                        </Accordion>
                    </nav>
                    <div className="p-5"></div>
                </div>
            </div>
        </>
    )
}

export default Sidebar