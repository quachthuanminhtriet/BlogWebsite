import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPIs, endpoints } from '../Configs/APIs';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';
import { FaRegBell } from 'react-icons/fa';

const Header = () => {
    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [cookies, removeCookie] = useCookies(['access-token']);
    const [notification, setNotifications] = useState('');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await authAPIs().get(endpoints['current-user']);
                setUserName(response.data.first_name);
            } catch (error) {
                console.error('Error fetching current user:', error);
            } finally {
                setLoading(false);
            }
        };

        const checkAuthStatus = () => {
            const token = cookies['access-token'];
            return token ? true : false;
        };

        const fetchUnreadNotifications = async () => {
            try {
                const token = cookies['access-token'];
                const response = await authAPIs().get(`${endpoints['users']}unread-notifications/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUnreadCount(response.data.unread_count);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        if (checkAuthStatus()) {
            setIsLoggedIn(true);
            fetchCurrentUser();
            fetchUnreadNotifications();

            const token = cookies['access-token'];
            const eventSource = new EventSource(`http://127.0.0.1:8000/sse/notifications/?token=${token}`);

            eventSource.onmessage = function (event) {
                setNotifications(prevNotifications => [...prevNotifications, event.data]);
                setUnreadCount(prevCount => prevCount + 1);
            };

            eventSource.onerror = function (event) {
                console.error('EventSource failed:', event);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, [cookies]);

    const handleLogout = async () => {
        try {
            removeCookie('access-token');
            sessionStorage.removeItem('access-token');
            setUserName('');
            setIsLoggedIn(false);
            console.log('Đăng xuất thành công.');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        if (link === '/contact') {
            const footerElement = document.getElementById('footer-contact');
            if (footerElement) {
                footerElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="header">
            <div className="nameblog">
                <div className="mainname">BLOG CHILL</div>
                <div className="bio">Thoughts on Lifestyle & Mental Health</div>
            </div>
            <ul className="urlblog">
                <li>
                    <Link
                        to="/"
                        onClick={() => handleLinkClick('/')}
                        className={activeLink === '/' ? 'activelink' : ''}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/blog"
                        onClick={() => handleLinkClick('/blog')}
                        className={activeLink === '/blog' ? 'activelink' : ''}
                    >
                        Blog
                    </Link>
                </li>
                <li>
                    <Link
                        to="/about"
                        onClick={() => handleLinkClick('/about')}
                        className={activeLink === '/about' ? 'activelink' : ''}
                    >
                        About
                    </Link>
                </li>
                {location.pathname === '/' &&
                    <li>
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                handleLinkClick('/contact');
                            }}
                        >
                            Contact
                        </Link>
                    </li>}
                <li>
                    {loading ? (
                        <div>Loading...</div>
                    ) : isLoggedIn ? (
                        <div className='logout'>
                            <div className='username'>Welcome, {userName}</div>
                            <Button onClick={handleLogout} className='logout'>Logout</Button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => handleLinkClick('/login')}
                            className={activeLink === '/login' || activeLink === '/register' ? 'activelink' : ''}
                        >
                            Login
                        </Link>
                    )}
                </li>
                <li>
                    <div className='notification '>
                        <Link to="/notification"
                            onClick={() => {
                                handleLinkClick('/notification');
                                setUnreadCount(0); // Reset unread count
                            }}
                            className={activeLink === '/notification' ? 'activelink' : ''}>
                            <FaRegBell className='icon'/>
                            {unreadCount > 0 && (
                                <span className="notification-count">{unreadCount}</span>
                            )}
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Header;
