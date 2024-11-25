import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import urlImg from '../../static/about.png'
import APIs, { authAPIs, endpoints } from '../Configs/APIs';
import { useCookies } from "react-cookie";

const About = () => {
    const [email, setEmail] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [nationality, setNationality] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState('');


    const fetchCurrentUser = async () => {
        try {
            const res = await authAPIs().get(endpoints['current-user']);
            setRole(res.data.role);
            console.log(res.data.role)
        } catch (error) {
            console.error('Error fetching current user:', error);
            setIsLoggedIn(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await APIs.get(endpoints['users']); // Giả sử đây là endpoint để lấy danh sách người dùng
            const users = response.data; // Giả sử response.data là mảng người dùng

            if (users && users.length > 0) {
                const user = users[0];
                setEmail(user.email);
                setBirthDay(user.birthDay);
            }
            console.log(users.data)
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoggedIn(false);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    const handleEdit = () => {
        alert('Chỉnh sửa thông tin');
        setIsEditing(true);
    };


    return (
        <div className="about">
            <header className="detailheader">
                <h1>ABOUT ME</h1>
            </header>
            <div className='contentimage'>
                <div className='content'>
                    <h3>A mental health advocate & blogger</h3>
                    <p>I'm a paragraph. Click here to add your own text and edit me...</p>
                </div>
                <div className='profile'>
                    <div>
                        <Image src={urlImg} alt="detailimage" />
                    </div>
                    <div>
                        <h1>Hi! I'm LLKwong</h1>
                        <table>
                            <tr>
                                <td><strong>Birthday:</strong></td>
                                <td></td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={birthDay}
                                            onChange={(e) => setBirthDay(e.target.value)}
                                        />
                                    ) : (
                                        <span>{birthDay}</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Nationality:</strong></td>
                                <td></td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                        />
                                    ) : (
                                        <span>{nationality}</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td></td>
                                <td>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    ) : (
                                        <span>{email}</span>
                                    )}
                                </td>
                            </tr>
                        </table>
                        {isLoggedIn && role === 'blogger' && (
                            <Button onClick={isEditing ? handleSave : handleEdit}>
                                {isEditing ? 'Save' : 'Edit'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
