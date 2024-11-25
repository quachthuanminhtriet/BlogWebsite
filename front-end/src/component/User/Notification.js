import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies] = useCookies(['access-token']);
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies['access-token'];

        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoggedIn(true);

        // Đánh dấu tất cả các thông báo chưa đọc thành đã đọc
        const markNotificationsAsRead = async () => {
            try {
                await axios.patch('http://127.0.0.1:8000/users/mark-all-notifications-read/', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        };

        // Gọi API để đánh dấu thông báo đã đọc
        markNotificationsAsRead();

        // Fetch notifications list
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/users/notifications/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Set up SSE for real-time notifications
        const eventSource = new EventSource(`http://127.0.0.1:8000/sse/notifications/?token=${token}`);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data); // Giả sử thông báo là đối tượng JSON
            setNotifications(prevNotifications => [...prevNotifications, data]);
        };

        eventSource.onerror = function (event) {
            console.error('EventSource failed:', event);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [cookies, navigate]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div>
            <h3>Thông Báo:</h3>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notification;
