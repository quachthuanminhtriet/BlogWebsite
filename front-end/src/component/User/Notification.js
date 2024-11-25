import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Image } from 'react-bootstrap';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies] = useCookies(['access-token']);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies['access-token'];

        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoggedIn(true);

        // Fetch notifications with pagination
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/users/notifications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: currentPage,
                    }
                });
                setNotifications(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 10));
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Set up SSE for real-time notifications
        const eventSource = new EventSource(`http://127.0.0.1:8000/sse/notifications/?token=${token}`);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log("Received Data:", data);
            setNotifications(prevNotifications => [...prevNotifications, data]);
        };

        eventSource.onerror = function (event) {
            console.error('EventSource failed:', event);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [cookies, navigate, currentPage]);

    if (!isLoggedIn) {
        return null;
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className='notification'>
            <div className='detailheader'>
                <h1>NOTIFICATIONS</h1>
            </div>
            <table className='notification_table'>
                <thead>
                    <tr>
                        <th>Thông báo</th>
                        <th>Thời gian</th>
                        <th>Ảnh cover</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification, index) => (
                        <tr key={index}>
                            <td>{notification.message}</td>
                            <td>{formatDistanceToNow(new Date(notification.create_date), { addSuffix: true, locale: vi })}</td>
                            <td id='img'>
                                {notification.urlImage && <img src={notification.urlImage} alt="Blog cover" style={{ width: "100px", height: "auto" }} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Notification;
