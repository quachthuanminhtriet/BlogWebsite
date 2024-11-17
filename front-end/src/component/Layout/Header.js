import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPIs, endpoints } from '../Configs/APIs';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';

const Header = () => {
    const [activeLink, setActiveLink] = useState('/');
    const contactRef = useRef(null);
    const location = useLocation();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies, removeCookie] = useCookies(['access-token']);

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

        if (checkAuthStatus()) {
            setIsLoggedIn(true);
            fetchCurrentUser();
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, [cookies, userName]);

    const handleLogout = () => {
        removeCookie('access-token');
        setIsLoggedIn(false);
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
                            className={activeLink === '/login' || activeLink === '/register' ? 'activelink' : ''} // Fixed active link check
                        >
                            Login
                        </Link>
                    )}
                </li>
                <div ref={contactRef} className="contact-section"></div>
            </ul>
        </div>
    );
};

export default Header;
