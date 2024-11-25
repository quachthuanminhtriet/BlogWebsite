import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import urlImg from '../../static/about.png'
import APIs, { authAPIs, endpoints } from '../Configs/APIs';
import { useCookies } from 'react-cookie';

const About = () => {
    const [email, setEmail] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [nationality, setNationality] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState('');
    const [cookies] = useCookies(['access-token']);

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
                setNationality(user.nationality);
                setEmail(user.email);
                setBirthDay(user.birthday);
            }
            console.log(users.data)
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoggedIn(false);
        }
    };

    const handleSave = async () => {
        const token = cookies['access-token'];
        try {
            const updatedData = {
                email,
                birthday: birthDay,
                nationality,
            };

            const response = await APIs.patch(
                `${endpoints['users']}1/update-info/`,
                updatedData,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  }
                }
              );

            console.log('User info updated successfully:', response.data);
            alert('Chỉnh Sửa thành công');
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Đã xảy ra lỗi trong quá trình vui lòng thử lại!');
        } finally {
            setIsEditing(false);
        }
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
                <p>I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.</p>
                <p>This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business and what makes you different from your competitors. Make your company stand out and show your visitors who you are. </p>
                <p>At Wix we’re passionate about making templates that allow you to build fabulous websites and it’s all thanks to the support and feedback from users like you! Keep up to date with New Releases and what’s Coming Soon in Wix ellaneous in Support. Feel free to tell us what you think and give us feedback in the Wix Forum. If you’d like to benefit from a professional designer’s touch, head to the Wix Arena and connect with one of our Wix Pro designers. Or if you need more help you can simply type your questions into the Support Forum and get instant answers. To keep up to date with everything Wix, including tips and things we think are cool, just head to the Wix Blog!</p>
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
                            <td>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={birthDay ? birthDay.split('T')[0] : ''}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                    />
                                ) : (
                                    <span>{birthDay ? new Date(birthDay).toLocaleDateString('en-GB') : ''}</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Nationality:</strong></td>
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
                        <Button className='edit' onClick={isEditing ? handleSave : handleEdit}>
                            {isEditing ? 'Save' : 'Edit Profile'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default About;
